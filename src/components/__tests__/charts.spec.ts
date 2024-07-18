import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import {useActivityStore} from '@/stores/activityStore';
import WeekStatusChart from '@/components/charts/WeekStatusChart.vue';
import WeeklyCategoriesChart from '@/components/charts/WeeklyCategoriesChart.vue';
import WeeklyAmountsChart from '../charts/WeeklyAmountsChart.vue';

describe('charts', () => {
  let activityStore: ReturnType<typeof useActivityStore>;
  beforeEach(() => {
    activityStore = useActivityStore();
  });

  it('prepares data for WeekStatusChart', () => {
    const wrapper = mount(WeekStatusChart, {
      shallow: true,
      props: {
        // Three roots, two vegetables, one leafy green
        currentVeggies: ['onion', 'garlic', 'tomato', 'endive', 'cucumber', 'carrot'],
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
    const now = DateTime.now();
    const lastWeek = now.minus({weeks: 1});
    const twoWeeksAgo = now.minus({weeks: 2});
    const fiveWeeksAgo = now.minus({weeks: 5});

    activityStore.settings.startDate = fiveWeeksAgo.startOf('week');
    activityStore.activities.push(
      {
        veggie: 'onion',
        date: now,
      },
      {
        veggie: 'tomato',
        date: now,
      },
      {
        veggie: 'apple',
        date: now,
      },
      {
        veggie: 'pineapple',
        date: now,
      },
      {
        veggie: 'carrot',
        date: lastWeek,
      },
      {
        veggie: 'pinto bean',
        date: lastWeek,
      },
      {
        veggie: 'oat',
        date: twoWeeksAgo,
      },
      {
        veggie: 'wheat',
        date: twoWeeksAgo,
      },
      {
        veggie: 'endive',
        date: fiveWeeksAgo,
      },
    );

    const wrapper = mount(WeeklyCategoriesChart, {
      shallow: true,
    });

    // Leafy category & week 1 are dropped out
    const {labels, datasets} = wrapper.vm.chartData;
    expect(labels).toEqual(['Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6']);
    expect(datasets).toHaveLength(5);
    expect(datasets[0].label).toBe('Fruits And Berries');
    expect(datasets[0].data).toEqual([0, 0, 0, 0, 2]);
    expect(datasets[1].label).toBe('Vegetables');
    expect(datasets[1].data).toEqual([0, 0, 0, 0, 1]);
    expect(datasets[2].label).toBe('Roots And Bulbs');
    expect(datasets[2].data).toEqual([0, 0, 0, 1, 1]);
    expect(datasets[3].label).toBe('Beans And Legumes');
    expect(datasets[3].data).toEqual([0, 0, 0, 1, 0]);
    expect(datasets[4].label).toBe('Grains, Nuts, And Seeds');
    expect(datasets[4].data).toEqual([0, 0, 2, 0, 0]);
  });

  it('prepares data for WeeklyAmountsChart', () => {
    const now = DateTime.now();
    const lastWeek = now.minus({weeks: 1});
    const twoWeeksAgo = now.minus({weeks: 2});
    const fiveWeeksAgo = now.minus({weeks: 5});

    activityStore.settings.startDate = fiveWeeksAgo.startOf('week');
    activityStore.activities.push(
      {
        veggie: 'onion',
        date: now,
      },
      {
        veggie: 'tomato',
        date: now,
      },
      {
        veggie: 'apple',
        date: now,
      },
      {
        veggie: 'pineapple',
        date: now,
      },
      {
        veggie: 'carrot',
        date: lastWeek,
      },
      {
        veggie: 'pinto bean',
        date: lastWeek,
      },
      {
        veggie: 'oat',
        date: twoWeeksAgo,
      },
      {
        veggie: 'wheat',
        date: twoWeeksAgo,
      },
      {
        veggie: 'endive',
        date: fiveWeeksAgo,
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
