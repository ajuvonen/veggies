import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {useAppStateStore} from '@/stores/appStateStore';
import {useActivityStore} from '@/stores/activityStore';
import SettingsView from '@/views/SettingsView.vue';
import DialogStub from './DialogStub.vue';

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
});
