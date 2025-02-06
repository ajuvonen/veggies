import {useMemoize} from '@vueuse/core';
import type {ChartOptions, ChartTypeRegistry} from 'chart.js';
import type {Context} from 'chartjs-plugin-datalabels';
import {DateTime} from 'luxon';
import {mergeDeep} from 'remeda';
import {
  FRUITS,
  VEGETABLES,
  LEAFIES,
  ROOTS,
  BEANS,
  COLORS,
  CATEGORY_EMOJI,
  ALL_VEGGIES,
  GRAINS,
} from '@/utils/constants';
import {Category} from '@/utils/types';

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
  } else if (GRAINS.includes(veggie)) {
    return Category.Grain;
  }
  return undefined;
});

export const getChartOptions = <T extends keyof ChartTypeRegistry>(
  grids: boolean,
  stacked: boolean,
  withIcons: boolean,
  overrides: Partial<ChartOptions<T>> = {},
) =>
  mergeDeep(
    {
      responsive: true,
      maintainAspectRatio: !grids,
      layout: {
        padding: 0,
      },
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
          display: false,
        },
        legend: {
          display: false,
        },
        datalabels: {
          ...(withIcons
            ? {
                anchor: 'center',
                align: 'center',
                font: {
                  size: 25,
                },
                textShadowColor: '#fff',
                textShadowBlur: 5,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter: (value: any, {dataset: {label}}: Context) =>
                  value ? CATEGORY_EMOJI[label as Category] : '',
              }
            : {
                display: false,
              }),
        },
        tooltip: {
          padding: 8,
          titleFont: {
            size: 14,
            weight: 'normal',
          },
          bodyFont: {
            size: 14,
          },
          footerFont: {
            size: 14,
            weight: 'normal',
          },
          displayColors: false,
          backgroundColor: COLORS.darkBlue,
          bodyColor: COLORS.offWhite,
          titleColor: COLORS.offWhite,
        },
      },
    },
    overrides,
  ) as ChartOptions<T>;

export const getRandomVeggie = () => ALL_VEGGIES[Math.floor(Math.random() * ALL_VEGGIES.length)];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dateParser = (key: string, value: any) => {
  if (key === 'startDate' && value) {
    return DateTime.fromISO(value.split('T')[0]);
  }
  return value;
};

const veggieEmojis = [
  '🥝',
  '🥥',
  '🍇',
  '🍈',
  '🍉',
  '🍊',
  '🍋',
  '🍌',
  '🍍',
  '🥭',
  '🍎',
  '🍏',
  '🍐',
  '🍑',
  '🍒',
  '🍓',
  '🫐',
  '🍅',
  '🍆',
  '🌽',
  '🌶️',
  '🫑',
  '🥑',
  '🥒',
  '🥬',
  '🥦',
  '🥔',
  '🧄',
  '🧅',
  '🥕',
  '🫛',
  '🥜',
  '🫘',
  '🌿',
] as const;
export const getRandomEmojis = (amount: number = 1) => {
  const emojis = new Set<string>();
  while (emojis.size < amount) {
    emojis.add(veggieEmojis[Math.floor(Math.random() * veggieEmojis.length)]);
  }
  return Array.from(emojis);
};
