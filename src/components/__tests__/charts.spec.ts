import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import {take} from 'remeda';
import {BEANS, GRAINS, LEAFIES, MUSHROOMS, ROOTS, VEGETABLES} from '@/utils/constants';
import {useActivityStore} from '@/stores/activityStore';
import CategoryStatusChart from '@/components/charts/CategoryStatusChart.vue';
import WeeklyCategoriesChart from '@/components/charts/WeeklyCategoriesChart.vue';
import WeeklyAmountsChart from '@/components/charts/WeeklyAmountsChart.vue';
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
    activityStore.weeks = [
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
    ];

    const wrapper = mount(WeeklyCategoriesChart);

    // Leafies & mushrooms are dropped out
    const {labels, datasets} = wrapper.vm.chartData;
    expect(labels).toEqual([
      thisWeek.toFormat('W/kkkk'),
      thisWeek.minus({weeks: 1}).toFormat('W/kkkk'),
      thisWeek.minus({weeks: 2}).toFormat('W/kkkk'),
      thisWeek.minus({weeks: 3}).toFormat('W/kkkk'),
      thisWeek.minus({weeks: 4}).toFormat('W/kkkk'),
      thisWeek.minus({weeks: 5}).toFormat('W/kkkk'),
    ]);
    expect(datasets).toHaveLength(6);
    expect(datasets[0].label).toBe('Fruit');
    expect(datasets[0].data).toEqual([2, 0, 0, 0, 0, 0]);
    expect(datasets[1].label).toBe('Vegetable');
    expect(datasets[1].data).toEqual([1, 0, 0, 0, 0, 0]);
    expect(datasets[2].label).toBe('Leafy');
    expect(datasets[2].data).toEqual([0, 0, 0, 0, 0, 1]);
    expect(datasets[3].label).toBe('Root');
    expect(datasets[3].data).toEqual([1, 1, 0, 0, 0, 0]);
    expect(datasets[4].label).toBe('Bean');
    expect(datasets[4].data).toEqual([0, 1, 0, 0, 0, 0]);
    expect(datasets[5].label).toBe('Grain');
    expect(datasets[5].data).toEqual([0, 0, 2, 0, 0, 0]);
  });

  it('prepares data for WeeklyAmountsChart', () => {
    activityStore.startDate = fiveWeeksAgo;
    activityStore.weeks = [
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
    ];

    const wrapper = mount(WeeklyAmountsChart);

    const {labels, datasets} = wrapper.vm.chartData;
    expect(labels).toEqual([
      thisWeek.toFormat('W/kkkk'),
      thisWeek.minus({weeks: 1}).toFormat('W/kkkk'),
      thisWeek.minus({weeks: 2}).toFormat('W/kkkk'),
      thisWeek.minus({weeks: 3}).toFormat('W/kkkk'),
      thisWeek.minus({weeks: 4}).toFormat('W/kkkk'),
      thisWeek.minus({weeks: 5}).toFormat('W/kkkk'),
    ]);
    expect(datasets).toHaveLength(1);
    expect(datasets[0].data).toEqual([4, 2, 2, 0, 0, 1]);
  });

  const getPercentage = (group: string[], amount: number) =>
    Math.round((amount / group.length) * 100);
  it('prepares data for VeggieCompletionChart', () => {
    const wrapper = mount(VeggieCompletionChart, {
      props: {
        veggies: [
          ...take(VEGETABLES, 10),
          ...take(LEAFIES, 20),
          ...ROOTS,
          ...take(BEANS, 20),
          ...take(GRAINS, 20),
          ...MUSHROOMS,
        ],
      },
    });
    const {
      labels,
      datasets: [{data}],
    } = wrapper.vm.chartData;
    expect(labels).toEqual(['Fruit', 'Vegetable', 'Leafy', 'Root', 'Bean', 'Grain', 'Mushroom']);
    expect(data).toEqual([
      0,
      getPercentage(VEGETABLES, 10),
      getPercentage(LEAFIES, 20),
      100,
      getPercentage(BEANS, 20),
      getPercentage(GRAINS, 20),
      100,
    ]);
  });
});
