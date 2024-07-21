import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import {useActivityStore} from '@/stores/activityStore';
import CategoryStatusChart from '@/components/charts/CategoryStatusChart.vue';
import WeeklyCategoriesChart from '@/components/charts/WeeklyCategoriesChart.vue';
import WeeklyAmountsChart from '@/components/charts/WeeklyAmountsChart.vue';
import AllTimeCategoriesChart from '@/components/charts/AllTimeCategoriesChart.vue';

describe('charts', () => {
  const thisWeek = DateTime.now().startOf('week');
  const lastWeek = thisWeek.minus({weeks: 1});
  const twoWeeksAgo = thisWeek.minus({weeks: 2});
  const fiveWeeksAgo = thisWeek.minus({weeks: 5});
  let activityStore: ReturnType<typeof useActivityStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
  });

  it('prepares data for CategoryStatusChart', () => {
    const wrapper = mount(CategoryStatusChart, {
      shallow: true,
      props: {
        // Three roots, two vegetables, one leafy green
        veggies: ['onion', 'garlic', 'tomato', 'endive', 'cucumber', 'carrot'],
      },
    });
    const {
      labels,
      datasets: [{data}],
    } = wrapper.vm.chartData;
    expect(labels).toEqual(['leafy', 'vegetable', 'root']);
    expect(data).toEqual([1, 2, 3]);
  });

  it('prepares data for AllTimeCategoriesChart', () => {
    const wrapper = mount(AllTimeCategoriesChart, {
      shallow: true,
      props: {
        // Three roots, two vegetables, one leafy green
        veggies: ['onion', 'garlic', 'tomato', 'endive', 'cucumber', 'carrot'],
      },
    });
    const {
      labels,
      datasets: [{data}],
    } = wrapper.vm.chartData;
    expect(labels).toEqual(['leafy', 'vegetable', 'root']);
    expect(data).toEqual([1, 2, 3]);
  });

  it('prepares data for WeeklyCategoriesChart', () => {
    activityStore.settings.startDate = fiveWeeksAgo;
    activityStore.weeks.push(
      {
        startDate: fiveWeeksAgo,
        veggies: ['endive'],
      },
      {
        startDate: twoWeeksAgo,
        veggies: ['oat', 'wheat'],
      },
      {
        startDate: lastWeek,
        veggies: ['carrot', 'pinto bean'],
      },
      {
        startDate: thisWeek,
        veggies: ['onion', 'tomato', 'apple', 'pineapple'],
      },
    );

    const wrapper = mount(WeeklyCategoriesChart, {
      shallow: true,
    });

    // Leafy category & week 1 are dropped out
    const {labels, datasets} = wrapper.vm.chartData;
    expect(labels).toEqual(['Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6']);
    expect(datasets).toHaveLength(5);
    expect(datasets[0].label).toBe('fruit');
    expect(datasets[0].data).toEqual([0, 0, 0, 0, 2]);
    expect(datasets[1].label).toBe('vegetable');
    expect(datasets[1].data).toEqual([0, 0, 0, 0, 1]);
    expect(datasets[2].label).toBe('root');
    expect(datasets[2].data).toEqual([0, 0, 0, 1, 1]);
    expect(datasets[3].label).toBe('bean');
    expect(datasets[3].data).toEqual([0, 0, 0, 1, 0]);
    expect(datasets[4].label).toBe('grain');
    expect(datasets[4].data).toEqual([0, 0, 2, 0, 0]);
  });

  it('prepares data for WeeklyAmountsChart', () => {
    activityStore.settings.startDate = fiveWeeksAgo;
    activityStore.weeks.push(
      {
        startDate: fiveWeeksAgo,
        veggies: ['endive'],
      },
      {
        startDate: twoWeeksAgo,
        veggies: ['oat', 'wheat'],
      },
      {
        startDate: lastWeek,
        veggies: ['carrot', 'pinto bean'],
      },
      {
        startDate: thisWeek,
        veggies: ['onion', 'tomato', 'apple', 'pineapple'],
      },
    );

    const wrapper = mount(WeeklyAmountsChart, {
      shallow: true,
    });

    const {labels, datasets} = wrapper.vm.chartData;
    expect(labels).toEqual(['Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6']);
    expect(datasets).toHaveLength(1);
    expect(datasets[0].data).toEqual([0, 0, 2, 2, 4]);
  });
});
