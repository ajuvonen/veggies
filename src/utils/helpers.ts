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
  title: string = '',
  grids: boolean = false,
  stacked: boolean = false,
) =>
  ({
    responsive: true,
    maintainAspectRatio: !grids,
    scales: grids
      ? {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              color: COLORS.offWhite,
            },
            stacked,
          },
          x: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              color: COLORS.offWhite,
            },
            stacked,
          },
        }
      : undefined,
    plugins: {
      title: {
        display: !!title,
        color: COLORS.offWhite,
        text: title,
        font: {
          family: 'Nunito Variable, sans-serif',
          size: 18,
          weight: 'normal',
          style: 'normal',
        },
      },
      legend: {
        labels: {
          color: COLORS.offWhite,
        },
      },
      datalabels: {
        display: false,
      },
      tooltip: {
        boxPadding: 5,
      },
    },
  }) as ChartOptions<T>;
