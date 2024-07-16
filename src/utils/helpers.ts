import {useMemoize} from '@vueuse/core';
import {FRUITS, VEGETABLES, LEAFIES, ROOTS, BEANS, COLORS} from '@/utils/constants';
import {Category} from '@/utils/types';
import type {ChartOptions, ChartTypeRegistry} from 'chart.js';

export const getCategoryForVeggie = useMemoize((veggie: string) => {
  if (FRUITS.includes(veggie)) {
    return Category.Fruit;
  } else if (VEGETABLES.includes(veggie)) {
    return Category.Vegetable;
  } else if (LEAFIES.includes(veggie)) {
    return Category.Leafy;
  } else if (ROOTS.includes(veggie)) {
    return Category.Root;
  } else if (BEANS.includes(veggie)) {
    return Category.Bean;
  }
  return Category.Grain;
});

export const getChartOptions = <T extends keyof ChartTypeRegistry>(
  grids: boolean = false,
  stacked: boolean = false,
) =>
  ({
    responsive: true,
    maintainAspectRatio: !grids,
    color: COLORS.darkGrey,
    scales: grids
      ? {
          y: {
            ticks: {
              precision: 0,
            },
            stacked,
          },
          x: {
            ticks: {
              precision: 0,
            },
            stacked,
          },
        }
      : undefined,
    plugins: {
      datalabels: {
        display: false,
      },
      tooltip: {
        boxPadding: 5,
      },
    },
  }) as ChartOptions<T>;
