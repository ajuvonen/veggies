import {ref} from 'vue';
import {describe, it, expect, vi, afterEach, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import HomeView from '@/views/HomeView.vue';
import DialogStub from './DialogStub.vue';
import {useAppStateStore} from '@/stores/appStateStore';

const mocks = vi.hoisted(() => {
  vi.resetModules();
  return {
    usePreferredLanguages: vi.fn(() => ref(['en'])),
  };
});

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual('@vueuse/core');
  return {
    ...actual,
    usePreferredLanguages: mocks.usePreferredLanguages,
  };
});

describe('HomeView', () => {
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    appStateStore = useAppStateStore();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders', () => {
    const wrapper = mount(HomeView);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders in English if specific dialect preferred', () => {
    mocks.usePreferredLanguages.mockReturnValue(ref(['en-UK', 'fi']));
    mount(HomeView);
    expect(appStateStore.settings.locale).toBe('en');
  });

  it('renders in Finnish if preferred', async () => {
    mocks.usePreferredLanguages.mockReturnValue(ref(['fi', 'en']));
    mount(HomeView);
    expect(appStateStore.settings.locale).toBe('fi');
  });

  it('renders in English if no languages match locales preferred', () => {
    mocks.usePreferredLanguages.mockReturnValue(ref(['sv-SE', 'no']));
    mount(HomeView);
    expect(appStateStore.settings.locale).toBe('en');
  });

  it('shows dialog', async () => {
    const wrapper = mount(HomeView, {
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
    expect(wrapper.findByTestId('dialog').exists()).toBe(false);
    await wrapper.findByTestId('home-info-button').trigger('click');
    expect(wrapper.findByTestId('dialog').exists()).toBe(true);
  });
});
