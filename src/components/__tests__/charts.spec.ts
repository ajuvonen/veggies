import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import {useActivityStore} from '@/stores/activityStore';
import WeekStatusChart from '@/components/charts/WeekStatusChart.vue';
import WeeklyAmountsChart from '@/components/charts/WeeklyAmountsChart.vue';

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

  it('prepares data for WeeklyAmountsChart', () => {
    const now = DateTime.now();
    const lastWeek = now.minus({weeks: 1});
    const twoWeeksAgo = now.minus({weeks: 2});

    activityStore.settings.startDate = twoWeeksAgo.startOf('week');
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
    );

    const wrapper = mount(WeeklyAmountsChart, {
      shallow: true,
    });

    // Leafy category is dropped out
    const {labels, datasets} = wrapper.vm.chartData;
    expect(labels).toEqual(['Week 1', 'Week 2', 'Week 3']);
    expect(datasets).toHaveLength(5);
    expect(datasets[0].label).toBe('Fruits And Berries');
    expect(datasets[0].data).toEqual([0, 0, 2]);
    expect(datasets[1].label).toBe('Vegetables');
    expect(datasets[1].data).toEqual([0, 0, 1]);
    expect(datasets[2].label).toBe('Roots And Bulbs');
    expect(datasets[2].data).toEqual([0, 1, 1]);
    expect(datasets[3].label).toBe('Beans And Legumes');
    expect(datasets[3].data).toEqual([0, 1, 0]);
    expect(datasets[4].label).toBe('Grains, Nuts, And Seeds');
    expect(datasets[4].data).toEqual([2, 0, 0]);
  });
});
