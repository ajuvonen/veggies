import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import {take} from '@/test-utils';
import {BEANS, GRAINS, LEAFIES, MUSHROOMS, ROOTS, VEGETABLES} from '@/utils/veggieDetails';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import CategoryStatusChart from '@/components/charts/CategoryStatusChart.vue';
import WeeklyCategoriesChart from '@/components/charts/WeeklyCategoriesChart.vue';
import WeeklyAmountsChart from '@/components/charts/WeeklyAmountsChart.vue';
import VeggieCompletionChart from '@/components/charts/VeggieCompletionChart.vue';
import WeeklyHeatmap from '@/components/charts/WeeklyHeatmap.vue';

describe('charts', () => {
  const thisWeek = DateTime.now().startOf('week');
  const lastWeek = thisWeek.minus({weeks: 1});
  const twoWeeksAgo = thisWeek.minus({weeks: 2});
  const fiveWeeksAgo = thisWeek.minus({weeks: 5});

  const weekStartProps = [
    fiveWeeksAgo,
    fiveWeeksAgo.plus({weeks: 1}),
    fiveWeeksAgo.plus({weeks: 2}),
    twoWeeksAgo,
    lastWeek,
    thisWeek,
  ];
  const labelProps = weekStartProps.map((weekStart) => weekStart.toFormat('W/kkkk'));
  let activityStore: ReturnType<typeof useActivityStore>;
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
    appStateStore = useAppStateStore();
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
      accessibleData,
      datasets: [{data}],
    } = wrapper.vm.chartData;
    expect(labels).toEqual(['Leafy', 'Vegetable', 'Root']);
    expect(accessibleData.columnHeaders).toEqual([
      'Leafy Greens And Herbs',
      'Vegetables',
      'Roots And Bulbs',
    ]);
    expect(accessibleData.data).toEqual([1, 2, 3]);
    expect(data).toEqual([1, 2, 3]);
  });

  it('prepares data for WeeklyCategoriesChart', () => {
    appStateStore.settings.startDate = fiveWeeksAgo;
    activityStore.weeks = [
      {
        startDate: fiveWeeksAgo,
        veggies: ['endive'],
        challenge: 'cucumber',
      },
      {
        startDate: twoWeeksAgo,
        veggies: ['oat', 'wheat'],
        challenge: 'cucumber',
      },
      {
        startDate: lastWeek,
        veggies: ['carrot', 'pinto bean'],
        challenge: 'cucumber',
      },
      {
        startDate: thisWeek,
        veggies: ['onion', 'tomato', 'apple', 'pineapple'],
        challenge: 'cucumber',
      },
    ];

    const wrapper = mount(WeeklyCategoriesChart, {
      props: {
        weekStarts: weekStartProps,
        labels: labelProps,
      },
    });

    const {labels, accessibleData, datasets} = wrapper.vm.chartData;
    expect(labels).toEqual([
      thisWeek.minus({weeks: 5}).toFormat('W/kkkk'),
      thisWeek.minus({weeks: 4}).toFormat('W/kkkk'),
      thisWeek.minus({weeks: 3}).toFormat('W/kkkk'),
      thisWeek.minus({weeks: 2}).toFormat('W/kkkk'),
      thisWeek.minus({weeks: 1}).toFormat('W/kkkk'),
      thisWeek.toFormat('W/kkkk'),
    ]);
    expect(accessibleData.data).toEqual([
      [0, 0, 0, 0, 0, 2],
      [0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 1, 0],
      [0, 0, 0, 2, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);
    expect(accessibleData.rowHeaders).toEqual([
      'Fruits And Berries',
      'Vegetables',
      'Leafy Greens And Herbs',
      'Roots And Bulbs',
      'Beans And Legumes',
      'Grains, Nuts, And Seeds',
      'Mushrooms',
    ]);
    expect(datasets).toHaveLength(7);
    expect(datasets[0].label).toBe('Fruit');
    expect(datasets[0].data).toEqual([0, 0, 0, 0, 0, 2]);
    expect(datasets[1].label).toBe('Vegetable');
    expect(datasets[1].data).toEqual([0, 0, 0, 0, 0, 1]);
    expect(datasets[2].label).toBe('Leafy');
    expect(datasets[2].data).toEqual([1, 0, 0, 0, 0, 0]);
    expect(datasets[3].label).toBe('Root');
    expect(datasets[3].data).toEqual([0, 0, 0, 0, 1, 1]);
    expect(datasets[4].label).toBe('Bean');
    expect(datasets[4].data).toEqual([0, 0, 0, 0, 1, 0]);
    expect(datasets[5].label).toBe('Grain');
    expect(datasets[5].data).toEqual([0, 0, 0, 2, 0, 0]);
    expect(datasets[6].label).toBe('Mushroom');
    expect(datasets[6].data).toEqual([0, 0, 0, 0, 0, 0]);
  });

  it('prepares data for WeeklyAmountsChart', () => {
    appStateStore.settings.startDate = fiveWeeksAgo;
    activityStore.weeks = [
      {
        startDate: fiveWeeksAgo,
        veggies: ['endive'],
        challenge: 'cucumber',
      },
      {
        startDate: twoWeeksAgo,
        veggies: ['oat', 'wheat'],
        challenge: 'cucumber',
      },
      {
        startDate: lastWeek,
        veggies: ['carrot', 'pinto bean'],
        challenge: 'cucumber',
      },
      {
        startDate: thisWeek,
        veggies: ['onion', 'tomato', 'apple', 'pineapple'],
        challenge: 'cucumber',
      },
    ];

    const wrapper = mount(WeeklyAmountsChart, {
      props: {
        weekStarts: weekStartProps,
        labels: labelProps,
      },
    });

    const {labels, accessibleData, datasets} = wrapper.vm.chartData;
    expect(labels).toEqual([
      thisWeek.minus({weeks: 5}).toFormat('W/kkkk'),
      thisWeek.minus({weeks: 4}).toFormat('W/kkkk'),
      thisWeek.minus({weeks: 3}).toFormat('W/kkkk'),
      thisWeek.minus({weeks: 2}).toFormat('W/kkkk'),
      thisWeek.minus({weeks: 1}).toFormat('W/kkkk'),
      thisWeek.toFormat('W/kkkk'),
    ]);
    expect(accessibleData.data).toEqual([1, 0, 0, 2, 2, 4]);
    expect(datasets).toHaveLength(1);
    expect(datasets[0].data).toEqual([1, 0, 0, 2, 2, 4]);
  });

  const getPercentage = (group: ReadonlySet<string>, amount: number) =>
    Math.round((amount / group.size) * 100);
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
      accessibleData,
      datasets: [{data}],
    } = wrapper.vm.chartData;
    expect(labels).toEqual(['Fruit', 'Vegetable', 'Leafy', 'Root', 'Bean', 'Grain', 'Mushroom']);
    expect(accessibleData.columnHeaders).toEqual([
      'Fruits And Berries',
      'Vegetables',
      'Leafy Greens And Herbs',
      'Roots And Bulbs',
      'Beans And Legumes',
      'Grains, Nuts, And Seeds',
      'Mushrooms',
    ]);
    expect(accessibleData.data).toEqual([
      `${0} %`,
      `${getPercentage(VEGETABLES, 10)} %`,
      `${getPercentage(LEAFIES, 20)} %`,
      `${100} %`,
      `${getPercentage(BEANS, 20)} %`,
      `${getPercentage(GRAINS, 20)} %`,
      `${100} %`,
    ]);
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

  it('prepares data for WeeklyHeatmap', () => {
    const week1 = DateTime.fromISO('2025-12-01');
    const week2 = week1.plus({weeks: 1});
    const week3 = week2.plus({weeks: 1});
    appStateStore.settings.startDate = week1;
    activityStore.weeks = [
      {
        startDate: week2,
        veggies: [
          'carrot',
          'pinto bean',
          'chickpea',
          'black bean',
          'red bean',
          'cranberry bean',
          'adzuki bean',
          'edamame',
        ],
        challenge: 'cucumber',
      },
      {
        startDate: week3,
        veggies: ['onion', 'tomato', 'apple', 'pineapple', 'shiitake', 'portobello'],
        challenge: 'cucumber',
      },
    ];

    const heatmapWeeks = [week1, week2, week3];
    const heatmapLabels = heatmapWeeks.map((weekStart) => weekStart.toFormat('W/kkkk'));

    const wrapper = mount(WeeklyHeatmap, {
      props: {
        weekStarts: heatmapWeeks,
        labels: heatmapLabels,
      },
    });

    const {accessibleData, datasets} = wrapper.vm.chartData;
    expect(accessibleData.rowHeaders).toEqual([
      'Fruits And Berries',
      'Vegetables',
      'Leafy Greens And Herbs',
      'Roots And Bulbs',
      'Beans And Legumes',
      'Grains, Nuts, And Seeds',
      'Mushrooms',
    ]);
    expect(accessibleData.data).toEqual([
      ['0 %', '0 %', '33 %'],
      ['0 %', '0 %', '17 %'],
      ['0 %', '0 %', '0 %'],
      ['0 %', '17 %', '17 %'],
      ['0 %', '100 %', '0 %'],
      ['0 %', '0 %', '0 %'],
      ['0 %', '0 %', '33 %'],
    ]);
    expect(datasets).toHaveLength(1);
    expect(datasets[0].data).toMatchSnapshot();
  });
});
