import {nextTick, ref} from 'vue';
import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {mount, enableAutoUnmount} from '@vue/test-utils';
import {useAppStateStore} from '@/stores/appStateStore';
import ToastContainer from '@/components/ToastContainer.vue';

const mocks = vi.hoisted(() => ({
  usePointer: vi.fn(() => ({pointerType: ref('mouse')})),
}));

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual('@vueuse/core');
  return {
    ...actual,
    usePointer: mocks.usePointer,
  };
});

describe('ToastContainer', () => {
  enableAutoUnmount(afterEach);

  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    appStateStore = useAppStateStore();
  });

  afterEach(() => {
    vi.useRealTimers();
    // jsdom's document is shared by every test in this file; auto-unmount removes what
    // mount() attached, but not fixtures a test appends to the body itself.
    document.body.replaceChildren();
  });

  it('shows toast message', async () => {
    const wrapper = mount(ToastContainer);
    appStateStore.messages = [
      {
        id: crypto.randomUUID(),
        text: 'Test message',
      },
    ];
    await nextTick();
    expect(wrapper.findByTestId('toast-message').exists()).toBe(true);
    expect(wrapper.find('.toast-message__content').text()).toContain('Test message');
  });

  it('hides toast message on click', async () => {
    const wrapper = mount(ToastContainer);
    const id = crypto.randomUUID();
    appStateStore.messages = [
      {
        id,
        text: 'Test message',
      },
    ];
    await nextTick();
    await wrapper.findByTestId('toast-message').trigger('click');
    expect(appStateStore.removeToastMessage).toHaveBeenCalledWith(id);
  });

  it('does not hide toast message on touch', async () => {
    mocks.usePointer.mockReturnValueOnce({pointerType: ref('touch')});
    const wrapper = mount(ToastContainer);
    const id = crypto.randomUUID();
    appStateStore.messages = [
      {
        id,
        text: 'Test message',
      },
    ];
    await nextTick();
    // @vue/test-utils' trigger() cannot set a custom `detail` on a click event: MouseEvent.detail
    // is a getter-only property once constructed, and trigger() re-assigns options onto the event
    // a second time after construction, which throws for it. Dispatch a real pointer click
    // directly instead — this is the one test where a non-zero detail actually matters, since a
    // bare click's default detail (0, same as a keyboard-synthesized click) would let it through.
    wrapper
      .findByTestId('toast-message')
      .element.dispatchEvent(new MouseEvent('click', {detail: 1, bubbles: true, cancelable: true}));
    await nextTick();
    expect(appStateStore.removeToastMessage).not.toHaveBeenCalledWith(id);
  });

  it('hides toast message on keyboard activation even if the last pointer was touch', async () => {
    mocks.usePointer.mockReturnValueOnce({pointerType: ref('touch')});
    const wrapper = mount(ToastContainer);
    const id = crypto.randomUUID();
    appStateStore.messages = [
      {
        id,
        text: 'Test message',
      },
    ];
    await nextTick();
    await wrapper.findByTestId('toast-message').trigger('click');
    expect(appStateStore.removeToastMessage).toHaveBeenCalledWith(id);
  });

  it('hides toast message after timeout', async () => {
    vi.useFakeTimers();
    mount(ToastContainer);
    const id = crypto.randomUUID();
    appStateStore.messages = [
      {
        id,
        text: 'Test message',
      },
    ];
    await nextTick();
    await vi.advanceTimersByTimeAsync(5500);
    expect(appStateStore.removeToastMessage).toHaveBeenCalledWith(id);
  });

  // createTestingPinia stubs actions by default, so removeToastMessage never actually mutates
  // the store; the focus handoff tests below need it to, since they react to the updated
  // message list.
  const mockRealRemoval = () => {
    vi.mocked(appStateStore.removeToastMessage).mockImplementation((id: string) => {
      appStateStore.messages = appStateStore.messages.filter((message) => message.id !== id);
    });
  };

  it('moves focus to the remaining toast when the focused toast is closed', async () => {
    mockRealRemoval();
    const firstId = crypto.randomUUID();
    const secondId = crypto.randomUUID();
    appStateStore.messages = [
      {id: firstId, text: 'First message'},
      {id: secondId, text: 'Second message'},
    ];
    const wrapper = mount(ToastContainer, {attachTo: document.body});
    await nextTick();
    const firstToast = document.getElementById(`toast-${firstId}`) as HTMLElement;
    firstToast.focus();
    expect(document.activeElement).toBe(firstToast);
    await wrapper.find(`#toast-${firstId}`).trigger('click');
    await nextTick();
    expect(document.activeElement).toBe(document.getElementById(`toast-${secondId}`));
  });

  it('moves focus to the page heading when the last, focused toast is closed', async () => {
    mockRealRemoval();
    const id = crypto.randomUUID();
    appStateStore.messages = [{id, text: 'Test message'}];
    const heading = document.createElement('h1');
    // h1 isn't focusable by default; the app's real headings always carry this too.
    heading.tabIndex = -1;
    document.body.appendChild(heading);
    const wrapper = mount(ToastContainer, {attachTo: document.body});
    await nextTick();
    const toast = document.getElementById(`toast-${id}`) as HTMLElement;
    toast.focus();
    await wrapper.find(`#toast-${id}`).trigger('click');
    await nextTick();
    expect(document.activeElement).toBe(heading);
  });

  it('does not move focus when a toast closes without holding focus', async () => {
    mockRealRemoval();
    vi.useFakeTimers();
    const id = crypto.randomUUID();
    appStateStore.messages = [{id, text: 'Test message'}];
    mount(ToastContainer, {attachTo: document.body});
    await nextTick();
    const unrelatedInput = document.createElement('input');
    document.body.appendChild(unrelatedInput);
    unrelatedInput.focus();
    expect(document.activeElement).toBe(unrelatedInput);
    await vi.advanceTimersByTimeAsync(5500);
    expect(appStateStore.removeToastMessage).toHaveBeenCalledWith(id);
    expect(document.activeElement).toBe(unrelatedInput);
  });
});
