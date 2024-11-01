import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import {take} from 'remeda';
import {BEANS, GRAINS, LEAFIES, ROOTS, VEGETABLES} from '@/utils/constants';
import {useActivityStore} from '@/stores/activityStore';
import CategoryStatusChart from '@/components/charts/CategoryStatusChart.vue';
import WeeklyCategoriesChart from '@/components/charts/WeeklyCategoriesChart.vue';
import WeeklyAmountsChart from '@/components/charts/WeeklyAmountsChart.vue';
import AllTimeCategoriesChart from '@/components/charts/AllTimeCategoriesChart.vue';
import VeggieCompletionChart from '@/components/charts/VeggieCompletionChart.vue';

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
    expect(labels).toEqual(['Leafy', 'Vegetable', 'Root']);
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
    expect(labels).toEqual(['Leafy', 'Vegetable', 'Root']);
    expect(data).toEqual([1, 2, 3]);
  });

  it('prepares data for WeeklyCategoriesChart', () => {
    activityStore.startDate = fiveWeeksAgo;
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
    expect(datasets[0].label).toBe('Fruit');
    expect(datasets[0].data).toEqual([0, 0, 0, 0, 2]);
    expect(datasets[1].label).toBe('Vegetable');
    expect(datasets[1].data).toEqual([0, 0, 0, 0, 1]);
    expect(datasets[2].label).toBe('Root');
    expect(datasets[2].data).toEqual([0, 0, 0, 1, 1]);
    expect(datasets[3].label).toBe('Bean');
    expect(datasets[3].data).toEqual([0, 0, 0, 1, 0]);
    expect(datasets[4].label).toBe('Grain');
    expect(datasets[4].data).toEqual([0, 0, 2, 0, 0]);
  });

  it('prepares data for WeeklyAmountsChart', () => {
    activityStore.startDate = fiveWeeksAgo;
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

  const getPercentage = (group: string[], amount: number) =>
    Math.round((amount / group.length) * 100);
  it('prepares data for VeggieCompletionChart', () => {
    const wrapper = mount(VeggieCompletionChart, {
      shallow: true,
      props: {
        veggies: [
          ...take(VEGETABLES, 10),
          ...take(LEAFIES, 20),
          ...ROOTS,
          ...take(BEANS, 20),
          ...take(GRAINS, 20),
        ],
      },
    });
    const {
      labels,
      datasets: [{data}],
    } = wrapper.vm.chartData;
    expect(labels).toEqual(['Fruit', 'Vegetable', 'Leafy', 'Root', 'Bean', 'Grain']);
    expect(data).toEqual([
      0,
      getPercentage(VEGETABLES, 10),
      getPercentage(LEAFIES, 20),
      100,
      getPercentage(BEANS, 20),
      getPercentage(GRAINS, 20),
    ]);
  });

  it('shows all data when there are less than 5 weeks', () => {
    activityStore.startDate = twoWeeksAgo;
    activityStore.weeks.push(
      {
        startDate: twoWeeksAgo,
        veggies: ['tomato'],
      },
      {
        startDate: lastWeek,
        veggies: ['onion'],
      },
      {
        startDate: thisWeek,
        veggies: ['pineapple'],
      },
    );

    const wrapper = mount(WeeklyCategoriesChart, {
      shallow: true,
    });

    const {labels, datasets} = wrapper.vm.chartData;
    expect(labels).toEqual(['Wk 1', 'Wk 2', 'Wk 3']);
    expect(datasets).toHaveLength(3);
  });
});
