import {describe, it, expect, beforeEach, vi, afterEach} from 'vitest';
import {mount} from '@vue/test-utils';
import TurnstileWidget from '../TurnstileWidget.vue';

// Mock useScriptTag before importing component
const mocks = vi.hoisted(() => ({
  useScriptTag: vi.fn(() => ({
    load: vi.fn().mockResolvedValue(undefined),
  })),
}));

vi.mock('@vueuse/core', () => ({
  useScriptTag: mocks.useScriptTag,
}));

interface TurnstileWidgetInstance {
  reset: () => Promise<string>;
  widgetId?: string;
}

type MockTurnstile = {
  render: ReturnType<
    typeof vi.fn<(container: HTMLElement, options: TurnstileRenderOptions) => string | undefined>
  >;
  reset: ReturnType<typeof vi.fn<TurnstileApi['reset']>>;
  remove: ReturnType<typeof vi.fn<TurnstileApi['remove']>>;
};

describe('TurnstileWidget.vue', () => {
  let mockTurnstile: MockTurnstile;
  let capturedCallback: ((token: string) => void) | undefined;
  let capturedErrorCallback: ((code: string) => void) | undefined;
  let capturedExpiredCallback: (() => void) | undefined;
  let capturedUnsupportedCallback: (() => void) | undefined;

  beforeEach(() => {
    capturedCallback = undefined;
    capturedErrorCallback = undefined;
    capturedExpiredCallback = undefined;
    capturedUnsupportedCallback = undefined;

    mockTurnstile = {
      render: vi.fn((_container, options) => {
        capturedCallback = options.callback;
        capturedErrorCallback = options['error-callback'];
        capturedExpiredCallback = options['expired-callback'];
        capturedUnsupportedCallback = options['unsupported-callback'];
        return 'widget-id-123';
      }),
      reset: vi.fn(),
      remove: vi.fn(),
    };

    window.turnstile = mockTurnstile as unknown as TurnstileApi;
  });

  afterEach(() => {
    delete window.turnstile;
  });

  it('mounts, loads script, and renders widget with correct options', async () => {
    const wrapper = mount(TurnstileWidget, {
      props: {action: 'test-action', modelValue: ''},
    });

    // Wait for mount lifecycle to complete
    await wrapper.vm.$nextTick();

    expect(mocks.useScriptTag).toHaveBeenCalled();
    const {load} = mocks.useScriptTag.mock.results[0].value;
    expect(load).toHaveBeenCalled();

    expect(mockTurnstile.render).toHaveBeenCalledOnce();
    const [container, options] = mockTurnstile.render.mock.calls[0];
    expect(container).toBeDefined();
    expect(options.sitekey).toBeDefined();
    expect(options.action).toBe('test-action');
    expect(typeof options.callback).toBe('function');
    expect(typeof options['error-callback']).toBe('function');
    expect(typeof options['expired-callback']).toBe('function');
    expect(typeof options['unsupported-callback']).toBe('function');
  });

  it('callback success updates model, and reset() promise resolves with token', async () => {
    let resolvedToken: string | undefined;

    const wrapper = mount(TurnstileWidget, {
      props: {action: 'test', modelValue: ''},
    });
    await wrapper.vm.$nextTick();

    // Plain callback: updates model (emits update:modelValue)
    capturedCallback!('token-1');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['token-1']);

    // Callback after reset() is pending: resolves that promise
    const resetPromise = (wrapper.vm as unknown as TurnstileWidgetInstance).reset();
    capturedCallback!('token-2');
    await resetPromise.then((token: string) => {
      resolvedToken = token;
    });

    expect(resolvedToken).toBe('token-2');
  });

  it('error and unsupported callbacks emit events and reject pending reset', async () => {
    const wrapper = mount(TurnstileWidget, {
      props: {action: 'test', modelValue: ''},
    });
    await wrapper.vm.$nextTick();

    // error-callback
    const errorResetPromise = (wrapper.vm as unknown as TurnstileWidgetInstance).reset();
    capturedErrorCallback!('error-code-123');

    expect(wrapper.emitted('error')).toBeTruthy();
    expect(wrapper.emitted('error')?.[0]).toEqual(['error-code-123']);

    await expect(errorResetPromise).rejects.toBeUndefined();

    // unsupported-callback
    const unsupportedResetPromise = (wrapper.vm as unknown as TurnstileWidgetInstance).reset();
    capturedUnsupportedCallback!();

    expect(wrapper.emitted('unsupported')).toBeTruthy();

    await expect(unsupportedResetPromise).rejects.toBeUndefined();
  });

  it('expired-callback triggers internal reset and swallows rejection', async () => {
    const wrapper = mount(TurnstileWidget, {
      props: {action: 'test', modelValue: ''},
    });
    await wrapper.vm.$nextTick();

    mockTurnstile.reset.mockImplementationOnce(() => {
      // Simulate reset completing (callback would normally fire)
      capturedCallback!('expired-token');
    });

    // Invoke expired callback; it should call reset() without throwing
    capturedExpiredCallback!();

    expect(mockTurnstile.reset).toHaveBeenCalled();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['expired-token']);
  });

  it('exposed reset() method clears model, calls window.turnstile.reset, and resolves via callback; overlapping resets reject previous', async () => {
    const wrapper = mount(TurnstileWidget, {
      props: {action: 'test', modelValue: 'some-token'},
    });
    await wrapper.vm.$nextTick();

    // Normal reset
    const resetPromise1 = (wrapper.vm as unknown as TurnstileWidgetInstance).reset();

    // Check that model was cleared via emitted update
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
    expect(mockTurnstile.reset).toHaveBeenCalledOnce();

    // Overlapping reset: first promise rejects
    const resetPromise2 = (wrapper.vm as unknown as TurnstileWidgetInstance).reset();
    await expect(resetPromise1).rejects.toBeUndefined();

    // Resolve second via callback
    capturedCallback!('new-token');
    const token = await resetPromise2;
    expect(token).toBe('new-token');

    // Reset without widget ID: immediate rejection
    const vm = wrapper.vm as unknown as TurnstileWidgetInstance;
    vm.widgetId = undefined;
    const resetPromise3 = vm.reset();
    await expect(resetPromise3).rejects.toBeUndefined();
  });

  it('unmount removes widget; no-op if widgetId undefined', async () => {
    const wrapper = mount(TurnstileWidget, {
      props: {action: 'test', modelValue: ''},
    });
    await wrapper.vm.$nextTick();

    wrapper.unmount();
    expect(mockTurnstile.remove).toHaveBeenCalledWith('widget-id-123');

    // Fresh mount where render returns undefined
    mockTurnstile.render.mockReturnValueOnce(undefined);
    const wrapper2 = mount(TurnstileWidget, {
      props: {action: 'test', modelValue: ''},
    });
    await wrapper2.vm.$nextTick();

    expect(() => wrapper2.unmount()).not.toThrow();
    expect(mockTurnstile.remove).toHaveBeenCalledTimes(1); // Not called a second time
  });
});
