import {describe, it, expect, beforeEach, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import {getWeekStart} from '@/utils/helpers';
import StatsView from '@/views/StatsView.vue';

describe('StatsView', () => {
  const thisWeek = getWeekStart();
  let activityStore: ReturnType<typeof useActivityStore>;
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
    appStateStore = useAppStateStore();
  });

  it('renders all time statistics by default', () => {
    appStateStore.settings.startDate = thisWeek;
    activityStore.weeks = [
      {
        startDate: thisWeek,
        veggies: ['apple', 'raspberry', 'chickpea'],
        challenge: 'cucumber',
      },
    ];
    const wrapper = mount(StatsView);
    expect(wrapper.findByTestId('category-status-table').exists()).toBe(true);
  });

  it('shows weekly statistics', async () => {
    appStateStore.settings.startDate = thisWeek;
    activityStore.weeks = [
      {
        startDate: thisWeek,
        veggies: ['apple', 'raspberry', 'chickpea'],
        challenge: 'cucumber',
      },
    ];
    const wrapper = mount(StatsView);

    await wrapper.findByTestId('stats-tab-1').trigger('mousedown');
    await vi.dynamicImportSettled();
    expect(wrapper.findByTestId('weekly-amounts-chart').exists()).toBe(true);
    expect(wrapper.findByTestId('weekly-amounts-table').exists()).toBe(true);
    await wrapper.findByTestId('statistic-selector-1').trigger('click');
    await vi.dynamicImportSettled();
    expect(wrapper.findByTestId('weekly-categories-chart').exists()).toBe(true);
    expect(wrapper.findByTestId('weekly-categories-table').exists()).toBe(true);
    await wrapper.findByTestId('statistic-selector-2').trigger('click');
    await vi.dynamicImportSettled();
    expect(wrapper.findByTestId('weekly-heatmap').exists()).toBe(true);
    expect(wrapper.findByTestId('weekly-heatmap-table').exists()).toBe(true);
  });

  it('renders week editor', async () => {
    appStateStore.settings.startDate = thisWeek;
    activityStore.weeks = [
      {
        startDate: thisWeek,
        veggies: ['apple', 'raspberry', 'chickpea'],
        challenge: 'cucumber',
      },
    ];
    const wrapper = mount(StatsView);

    await wrapper.findByTestId('stats-tab-2').trigger('mousedown');
    await vi.dynamicImportSettled();
    expect(wrapper.findByTestId('week-editor-button').exists()).toBe(true);
  });

  it('renders veggie list', async () => {
    appStateStore.settings.startDate = thisWeek;
    activityStore.weeks = [
      {
        startDate: thisWeek,
        veggies: ['apple', 'raspberry', 'chickpea'],
        challenge: 'cucumber',
      },
    ];
    const wrapper = mount(StatsView);

    await wrapper.findByTestId('stats-tab-3').trigger('mousedown');
    await vi.dynamicImportSettled();
    expect(wrapper.findByTestId('veggie-completion-chart').exists()).toBe(true);
    expect(wrapper.findByTestId('veggie-completion-table').exists()).toBe(true);
  });

  it('renders achievements', async () => {
    appStateStore.settings.startDate = thisWeek;
    activityStore.weeks = [
      {
        startDate: thisWeek,
        veggies: ['apple', 'raspberry', 'chickpea'],
        challenge: 'cucumber',
      },
    ];
    const wrapper = mount(StatsView);

    await wrapper.findByTestId('stats-tab-4').trigger('mousedown');
    await vi.dynamicImportSettled();
    expect(wrapper.findByTestId('badge-thirtyVeggies-3').exists()).toBe(true);
  });
});
