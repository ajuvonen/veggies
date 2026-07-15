import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {take, makeWeekString} from '@/test-utils';
import {
  BEANS,
  GRAINS,
  LEAFIES,
  MUSHROOMS,
  ROOTS,
  VEGETABLES,
  BOTANICAL_BERRIES,
  CITRUSES,
  NUTS,
} from '@/utils/veggieDetails';
import {useActivityStore} from '@/stores/activityStore';
import {getWeekStart} from '@/utils/helpers';
import {useAppStateStore} from '@/stores/appStateStore';
import CategoryStatusChart from '@/components/charts/CategoryStatusChart.vue';
import WeeklyCategoriesChart from '@/components/charts/WeeklyCategoriesChart.vue';
import WeeklyAmountsChart from '@/components/charts/WeeklyAmountsChart.vue';
import VeggieCompletionChart from '@/components/charts/VeggieCompletionChart.vue';
import WeeklyHeatmap from '@/components/charts/WeeklyHeatmap.vue';
import WeeklyAchievementsChart from '@/components/charts/WeeklyAchievementsChart.vue';

describe('charts', () => {
  const thisWeek = getWeekStart();
  const lastWeek = thisWeek.subtract({weeks: 1});
  const twoWeeksAgo = thisWeek.subtract({weeks: 2});
  const labelProps = [twoWeeksAgo, lastWeek, thisWeek].map(
    (w) => `${w.weekOfYear}/${w.yearOfWeek}`,
  );
  const weekStartProps = [twoWeeksAgo, lastWeek, thisWeek];
  const weekStringProps = [twoWeeksAgo, lastWeek, thisWeek].map(makeWeekString);

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
    appStateStore.settings.startDate = twoWeeksAgo;
    activityStore.weeks = [
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
        weekData: {
          weekStarts: weekStartProps,
          labels: labelProps,
          weekStrings: weekStringProps,
        },
      },
    });

    const {labels, accessibleData, datasets} = wrapper.vm.chartData;
    expect(labels).toEqual(labelProps);
    expect(accessibleData.data).toEqual([
      ['0 %', '0 %', '50 %'],
      ['0 %', '0 %', '25 %'],
      ['0 %', '0 %', '0 %'],
      ['0 %', '50 %', '25 %'],
      ['0 %', '50 %', '0 %'],
      ['100 %', '0 %', '0 %'],
      ['0 %', '0 %', '0 %'],
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
    expect(datasets[0].data).toEqual([0, 0, 50]);
    expect(datasets[1].label).toBe('Vegetable');
    expect(datasets[1].data).toEqual([0, 0, 25]);
    expect(datasets[2].label).toBe('Leafy');
    expect(datasets[2].data).toEqual([0, 0, 0]);
    expect(datasets[3].label).toBe('Root');
    expect(datasets[3].data).toEqual([0, 50, 25]);
    expect(datasets[4].label).toBe('Bean');
    expect(datasets[4].data).toEqual([0, 50, 0]);
    expect(datasets[5].label).toBe('Grain');
    expect(datasets[5].data).toEqual([100, 0, 0]);
    expect(datasets[6].label).toBe('Mushroom');
    expect(datasets[6].data).toEqual([0, 0, 0]);
    // Verify datasets sum to 100 per week
    expect(datasets.reduce((sum, ds) => sum + (ds.data[0] || 0), 0)).toBe(100);
    expect(datasets.reduce((sum, ds) => sum + (ds.data[1] || 0), 0)).toBe(100);
    expect(datasets.reduce((sum, ds) => sum + (ds.data[2] || 0), 0)).toBe(100);
  });

  it('prepares data for WeeklyAmountsChart', () => {
    appStateStore.settings.startDate = twoWeeksAgo;
    activityStore.weeks = [
      {
        startDate: twoWeeksAgo,
        veggies: [],
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
        weekData: {
          weekStarts: weekStartProps,
          labels: labelProps,
          weekStrings: weekStringProps,
        },
      },
    });

    const {labels, accessibleData, datasets} = wrapper.vm.chartData;
    expect(labels).toEqual(labelProps);
    expect(accessibleData.data).toEqual([0, 2, 4]);
    expect(datasets).toHaveLength(1);
    expect(datasets[0].data).toEqual([0, 2, 4]);
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
      `0 %`,
      `${getPercentage(VEGETABLES, 10)} %`,
      `${getPercentage(LEAFIES, 20)} %`,
      `100 %`,
      `${getPercentage(BEANS, 20)} %`,
      `${getPercentage(GRAINS, 20)} %`,
      `100 %`,
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
    const week1 = Temporal.PlainDate.from('2025-12-01');
    const week2 = week1.add({weeks: 1});
    const week3 = week2.add({weeks: 1});
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
    const heatmapLabels = heatmapWeeks.map((w) => `${w.weekOfYear}/${w.yearOfWeek}`);
    const heatmapWeekStrings = heatmapWeeks.map(makeWeekString);

    const wrapper = mount(WeeklyHeatmap, {
      props: {
        weekData: {
          weekStarts: heatmapWeeks,
          labels: heatmapLabels,
          weekStrings: heatmapWeekStrings,
        },
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

  it('prepares data for WeeklyAchievementsChart', () => {
    const week1 = Temporal.PlainDate.from('2026-06-22');
    const week2 = week1.add({weeks: 1});
    const week3 = week2.add({weeks: 1});
    appStateStore.settings.startDate = week1;
    activityStore.weeks = [
      {
        startDate: week1,
        veggies: take(BOTANICAL_BERRIES, 15),
        challenge: 'cucumber',
      },
      {
        startDate: week2,
        veggies: [...take(BOTANICAL_BERRIES, 15), ...take(CITRUSES, 5)],
        challenge: 'lychee',
      },
      {
        startDate: week3,
        veggies: [],
        challenge: 'pineapple',
      },
    ];

    const heatmapWeeks = [week1, week2, week3];
    const heatmapLabels = heatmapWeeks.map((w) => `${w.weekOfYear}/${w.yearOfWeek}`);
    const heatmapWeekStrings = heatmapWeeks.map(makeWeekString);

    const wrapper = mount(WeeklyAchievementsChart, {
      props: {
        weekData: {
          weekStarts: heatmapWeeks,
          labels: heatmapLabels,
          weekStrings: heatmapWeekStrings,
        },
      },
    });

    const {accessibleData, datasets} = wrapper.vm.chartData;
    expect(datasets).toHaveLength(1);
    expect(datasets[0].data).toMatchSnapshot();
    expect(accessibleData.rowHeaders).toHaveLength(8);
    expect(accessibleData.data).toHaveLength(8); // 8 achievements
    expect(accessibleData.data[0]).toHaveLength(3); // 3 weeks per achievement
  });

  it('hides achievements for allergenic veggies in WeeklyAchievementsChart', () => {
    appStateStore.settings.startDate = twoWeeksAgo;
    appStateStore.settings.allergens = Array.from(NUTS);

    activityStore.weeks = [
      {
        startDate: twoWeeksAgo,
        veggies: [],
        challenge: 'chives',
      },
      {
        startDate: lastWeek,
        veggies: [],
        challenge: 'garlic',
      },
      {
        startDate: thisWeek,
        veggies: [],
        challenge: 'raspberry',
      },
    ];

    const wrapper = mount(WeeklyAchievementsChart, {
      props: {
        weekData: {
          weekStarts: weekStartProps,
          labels: labelProps,
          weekStrings: weekStringProps,
        },
      },
    });

    const {accessibleData, datasets} = wrapper.vm.chartData;
    expect(accessibleData.rowHeaders).toHaveLength(7);
    expect(accessibleData.data).toHaveLength(7);
    expect(accessibleData.rowHeaders.every((header) => header !== 'Go nuts')).toBe(true);
    expect(datasets[0].data.every((point) => point.rawData !== 'goNuts')).toBe(true);
  });
});
