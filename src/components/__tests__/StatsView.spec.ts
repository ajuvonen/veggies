import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import {useActivityStore} from '@/stores/activityStore';
import StatsView from '@/views/StatsView.vue';

describe('StatsView', () => {
  let activityStore: ReturnType<typeof useActivityStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
  });

  it('renders all time statistics by default', () => {
    activityStore.startDate = DateTime.now().startOf('week');
    activityStore.weeks = [
      {
        startDate: DateTime.now().startOf('week'),
        veggies: ['apple', 'raspberry', 'chickpea'],
      },
    ];
    const wrapper = mount(StatsView, {
      global: {
        stubs: {
          ListboxButton: true,
        },
      },
    });
    expect(wrapper.find('#category-status-table').exists()).toBe(true);
  });

  it('renders previous weeks', async () => {
    activityStore.startDate = DateTime.now().startOf('week');
    activityStore.weeks = [
      {
        startDate: DateTime.now().startOf('week'),
        veggies: ['apple', 'raspberry', 'chickpea'],
      },
    ];
    const wrapper = mount(StatsView);

    await wrapper.findByTestId('stats-tab-1').trigger('click');
    expect(wrapper.find('#weekly-amounts-table').exists()).toBe(true);
    expect(wrapper.find('#weekly-categories-table').exists()).toBe(true);
  });

  it('renders current week', async () => {
    activityStore.startDate = DateTime.now().startOf('week');
    activityStore.weeks = [
      {
        startDate: DateTime.now().startOf('week'),
        veggies: ['apple', 'raspberry', 'chickpea'],
      },
    ];
    const wrapper = mount(StatsView);

    await wrapper.findByTestId('stats-tab-2').trigger('click');
    expect(wrapper.findByTestId('week-editor').exists()).toBe(true);
  });

  it('renders veggie list', async () => {
    activityStore.startDate = DateTime.now().startOf('week');
    activityStore.weeks = [
      {
        startDate: DateTime.now().startOf('week'),
        veggies: ['apple', 'raspberry', 'chickpea'],
      },
    ];
    const wrapper = mount(StatsView);

    await wrapper.findByTestId('stats-tab-3').trigger('click');
    expect(wrapper.findByTestId('veggie-list').exists()).toBe(true);
  });

  it('renders achievements', async () => {
    activityStore.startDate = DateTime.now().startOf('week');
    activityStore.weeks = [
      {
        startDate: DateTime.now().startOf('week'),
        veggies: ['apple', 'raspberry', 'chickpea'],
      },
    ];
    const wrapper = mount(StatsView);

    await wrapper.findByTestId('stats-tab-4').trigger('click');
    expect(wrapper.findByTestId('achievement-list').exists()).toBe(true);
  });
});
