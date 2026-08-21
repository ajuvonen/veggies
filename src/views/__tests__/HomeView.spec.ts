import {describe, it, expect, vi, afterEach, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {DialogContent} from 'reka-ui';
import {areDatesEqual, getWeekStart} from '@/utils/helpers';
import {useAppStateStore} from '@/stores/appStateStore';
import {CURRENT_MIGRATION_VERSION} from '@/utils/constants';
import HomeView from '@/views/HomeView.vue';

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
    vi.spyOn(navigator, 'languages', 'get').mockReturnValueOnce(['en-UK', 'fi']);
    mount(HomeView);
    expect(appStateStore.settings.locale).toBe('en');
  });

  it('renders in Finnish if preferred', async () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValueOnce(['fi', 'en']);
    mount(HomeView);
    expect(appStateStore.settings.locale).toBe('fi');
  });

  it('renders in English if no languages match locales preferred', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValueOnce(['sv-SE', 'no']);
    mount(HomeView);
    expect(appStateStore.settings.locale).toBe('en');
  });

  it('shows dialog', async () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValueOnce(['en']);
    const wrapper = mount(HomeView);
    await wrapper.findByTestId('home-info-button').trigger('click');
    const dialog = wrapper.getComponent(DialogContent);
    expect(dialog.isVisible()).toBe(true);
    expect(dialog.html()).toMatchSnapshot();
  });

  it('sets startDate and migrationVersion when user starts', async () => {
    const thisWeek = getWeekStart();
    const wrapper = mount(HomeView);

    expect(appStateStore.settings.startDate).toBeNull();

    await wrapper.findByTestId('home-start-button').trigger('click');

    expect(appStateStore.settings.startDate).toBeInstanceOf(Temporal.PlainDate);
    expect(areDatesEqual(appStateStore.settings.startDate!, thisWeek)).toBe(true);
    expect(appStateStore.settings.migrationVersion).toBe(CURRENT_MIGRATION_VERSION);
  });
});
