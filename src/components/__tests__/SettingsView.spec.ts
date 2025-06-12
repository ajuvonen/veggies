import {computed, nextTick} from 'vue';
import {describe, it, expect, beforeEach, vi, afterEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {useAppStateStore} from '@/stores/appStateStore';
import {useActivityStore} from '@/stores/activityStore';
import SettingsView from '@/views/SettingsView.vue';
import DialogStub from './DialogStub.vue';

const mocks = vi.hoisted(() => ({
  usePreferredReducedMotion: vi.fn(() => computed(() => 'no-preference')),
}));

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual('@vueuse/core');
  return {
    ...actual,
    usePreferredReducedMotion: mocks.usePreferredReducedMotion,
  };
});

const mounter = () =>
  mount(SettingsView, {
    global: {
      stubs: {
        Dialog: DialogStub,
        DialogPanel: {
          template: '<div><slot /></div>',
        },
        DialogTitle: true,
      },
    },
  });

describe('SettingsView', () => {
  let activityStore: ReturnType<typeof useActivityStore>;
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
    appStateStore = useAppStateStore();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders', () => {
    const wrapper = mount(SettingsView, {
      global: {
        stubs: {
          BuildTime: true,
        },
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('toggles animations', async () => {
    const wrapper = mounter();
    expect(appStateStore.settings.showAnimations).toBe(true);
    const toggle = wrapper.findByTestId('show-animations-button');
    expect(toggle.attributes('disabled')).toBe(undefined);
    expect(toggle.attributes('data-headlessui-state')).toBe('checked');
    await toggle.trigger('click');
    expect(appStateStore.settings.showAnimations).toBe(false);
    expect(toggle.attributes('data-headlessui-state')).not.toBe('checked');
  });

  it('prevents animation toggle if all animations are disabled', () => {
    mocks.usePreferredReducedMotion.mockImplementation(() => computed(() => 'reduce'));
    const wrapper = mounter();
    const toggle = wrapper.findByTestId('show-animations-button');
    expect(appStateStore.settings.showAnimations).toBe(true);
    expect(toggle.attributes('disabled')).not.toBe(undefined);
    expect(toggle.attributes('data-headlessui-state')).not.toBe('checked');
  });

  it('resets the app', async () => {
    const wrapper = mounter();
    await wrapper.findByTestId('reset-button').trigger('click');
    await wrapper.findByTestId('confirm-button').trigger('click');
    expect(appStateStore.$reset).toBeCalledTimes(1);
    expect(activityStore.$reset).toBeCalledTimes(1);
  });

  it('cancels reset', async () => {
    const wrapper = mounter();
    await wrapper.findByTestId('reset-button').trigger('click');
    await wrapper.findByTestId('cancel-button').trigger('click');
    expect(appStateStore.$reset).toBeCalledTimes(0);
    expect(activityStore.$reset).toBeCalledTimes(0);
  });

  it('starts file download', async () => {
    const wrapper = mounter();
    const link = document.createElement('a');
    link.click = vi.fn();
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'https://eatyourveggies.app/'),
      revokeObjectURL: vi.fn(),
    });
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation(() => link);

    wrapper.findByTestId('export-button').trigger('click');
    await nextTick();
    try {
      expect(link.href).toBe('https://eatyourveggies.app/');
      expect(link.click).toHaveBeenCalledTimes(1);
    } finally {
      vi.unstubAllGlobals();
      createElementSpy.mockRestore();
    }
  });
});
