import {describe, it, expect, beforeEach, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import {useAppStateStore} from '@/stores/appStateStore';
import {useActivityStore} from '@/stores/activityStore';
import SettingsView from '@/views/SettingsView.vue';
import DialogStub from './DialogStub.vue';
import {nextTick} from 'vue';

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
    expect(appStateStore.settings.disableAnimations).toBe(false);
    await wrapper.findByTestId('disable-animations-button').trigger('click');
    expect(appStateStore.settings.disableAnimations).toBe(true);
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
