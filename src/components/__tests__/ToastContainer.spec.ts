import {nextTick, ref} from 'vue';
import {describe, it, expect, beforeEach, vi, afterEach} from 'vitest';
import {mount} from '@vue/test-utils';
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
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    appStateStore = useAppStateStore();
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
    expect(appStateStore.removeToastMessage).toBeCalledWith(id);
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
    await wrapper.findByTestId('toast-message').trigger('click');
    expect(appStateStore.removeToastMessage).not.toBeCalledWith(id);
  });

  it('hides toast message after timeout', async () => {
    mount(ToastContainer);
    const id = crypto.randomUUID();
    appStateStore.messages = [
      {
        id,
        text: 'Test message',
      },
    ];
    await new Promise((resolve) => setTimeout(resolve, 5600));
    expect(appStateStore.removeToastMessage).toBeCalledWith(id);
  }, 6000);
});
