import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {mount, enableAutoUnmount} from '@vue/test-utils';
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
  enableAutoUnmount(afterEach);

  it('renders', () => {
    const wrapper = mount(HomeView);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it.each([
    [['en-UK', 'fi'], 'en'],
    [['fi', 'en'], 'fi'],
    [['el', 'en'], 'el'],
    [['sv-SE', 'no'], 'en'],
  ])('resolves preferred languages %j to locale %s', (languages, expected) => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValueOnce(languages);
    mount(HomeView);
    expect(appStateStore.settings.locale).toBe(expected);
  });

  it('shows dialog', async () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValueOnce(['en']);
    const wrapper = mount(HomeView);
    expect(document.body.querySelector('[data-test-id="dialog"]')).toBeFalsy();
    await wrapper.findByTestId('home-info-button').trigger('click');
    expect(document.body.querySelector('[data-test-id="dialog"]')).toBeTruthy();
    const dialog = wrapper.getComponent(DialogContent);
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
