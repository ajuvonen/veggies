import {useMemoize} from '@vueuse/core';
import type {ChartOptions, ChartTypeRegistry} from 'chart.js';
import type {Context} from 'chartjs-plugin-datalabels';
import {
  FRUITS,
  VEGETABLES,
  LEAFIES,
  ROOTS,
  BEANS,
  COLORS,
  CATEGORY_EMOJI,
  ALL_VEGGIES,
} from '@/utils/constants';
import {Category} from '@/utils/types';
import {DateTime} from 'luxon';

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
  withIcons: boolean = false,
) =>
  ({
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
        display: !!title,
        color: COLORS.offWhite,
        text: title.toUpperCase(),
        padding: {
          top: 2,
          bottom: 8,
        },
        align: 'start',
        font: {
          family: 'Nunito, sans-serif',
          size: 12,
          weight: 'normal',
          style: 'normal',
        },
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
              textShadowBlur: 3,
              formatter: (value, {dataset: {label}}: Context) =>
                value ? CATEGORY_EMOJI[label as Category] : '',
            }
          : {
              display: false,
            }),
      },
      tooltip: {
        boxPadding: 5,
      },
    },
  }) as ChartOptions<T>;

export const getRandomVeggie = () => ALL_VEGGIES[Math.floor(Math.random() * ALL_VEGGIES.length)];

export const dateParser = (key: string, value: any) => {
  if (key === 'startDate' && value) {
    return DateTime.fromISO(value);
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
];
export const getRandomEmojis = (amount: number = 1) => {
  const emojis = new Set<string>();
  while (emojis.size < amount) {
    emojis.add(veggieEmojis[Math.floor(Math.random() * veggieEmojis.length)]);
  }
  return Array.from(emojis);
};
