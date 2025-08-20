import {useMemoize} from '@vueuse/core';
import type {ChartOptions, ChartType, Scale} from 'chart.js';
import type {Context} from 'chartjs-plugin-datalabels';
import {DateTime} from 'luxon';
import {mergeDeep, sample} from 'remeda';
import {
  BEANS,
  CATEGORY_EMOJI,
  FRUITS,
  GRAINS,
  LEAFIES,
  MUSHROOMS,
  ROOTS,
  VEGETABLES,
} from '@/utils/constants';
import {DEFAULT_LOCALE, DEFAULT_SETTINGS, LOCALES} from '@/utils/constants';
import {AchievementLevel, Category} from '@/utils/types';

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
  } else if (MUSHROOMS.includes(veggie)) {
    return Category.Mushroom;
  }
  return undefined;
});

export const getChartOptions = <T extends ChartType>(
  grids: boolean,
  stacked: boolean,
  withIcons: boolean,
  showChartAnimations: boolean,
  overrides: Partial<ChartOptions<T>> = {},
) =>
  mergeDeep(
    {
      animation: !showChartAnimations ? false : undefined,
      responsive: true,
      maintainAspectRatio: !grids,
      normalized: true,
      layout: {
        padding: 0,
      },
      scales: grids
        ? {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
                color: getComputedStyle(document.documentElement).getPropertyValue('--color-text'),
              },
              stacked,
            },
            y1: {
              position: 'right',
              beginAtZero: true,
              ticks: {
                precision: 0,
                color: getComputedStyle(document.documentElement).getPropertyValue('--color-text'),
              },
              stacked,
              afterBuildTicks: (axis: Scale) => {
                axis.ticks = [...axis.chart.scales.y.ticks];
                axis.min = axis.chart.scales.y.min;
                axis.max = axis.chart.scales.y.max;
              },
            },
            x: {
              beginAtZero: true,
              ticks: {
                precision: 0,
                color: getComputedStyle(document.documentElement).getPropertyValue('--color-text'),
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
          animation: showChartAnimations,
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
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue(
            '--color-ui-dark',
          ),
          bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--color-text'),
          titleColor: getComputedStyle(document.documentElement).getPropertyValue('--color-text'),
        },
      },
    },
    overrides,
  ) as ChartOptions<T>;

export const getRandomItem = <T>(availableItems: readonly T[] = []): T | undefined =>
  availableItems[Math.floor(Math.random() * availableItems.length)];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dateParser = (key: string, value: any) => {
  if (key.endsWith('Date') && value) {
    return DateTime.fromISO(value.split('T')[0]);
  }
  return value;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dateReplacer = (key: string, value: any) => {
  if (key.endsWith('Date') && value) {
    return value.split('T')[0];
  }
  return value;
};

const veggieEmojis: readonly string[] = [
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
  '🍄‍🟫',
  '🌾',
  '🌰',
];
export const getRandomEmojis = (amount: number = 1) => sample(veggieEmojis, amount);

export const achievementLevelHelper = (levels: [number, AchievementLevel][], value: number) =>
  levels.find(([threshold]) => value >= threshold)?.[1] ?? AchievementLevel.NoAchievement;

export const getImportSchema = async () => {
  const z = await import('zod/v4');
  const luxonDateTimeSchema = z.custom<DateTime<true>>(
    (val) => val instanceof DateTime && val.isValid,
    'Invalid DateTime instance',
  );
  return z.object({
    startDate: luxonDateTimeSchema,
    challenges: z.array(z.object({startDate: luxonDateTimeSchema, veggie: z.string()})).default([]),
    weeks: z
      .array(z.object({startDate: luxonDateTimeSchema, veggies: z.array(z.string())}))
      .default([]),
    settings: z
      .object({
        allergens: z.array(z.string()).default(DEFAULT_SETTINGS.allergens),
        locale: z.enum(LOCALES).catch(DEFAULT_LOCALE).default(DEFAULT_LOCALE),
        showChartAnimations: z
          .boolean()
          .catch(DEFAULT_SETTINGS.showChartAnimations)
          .default(DEFAULT_SETTINGS.showChartAnimations),
        suggestionCount: z
          .number()
          .refine((val) => [0, 5, 10, 15, 20].includes(val))
          .catch(DEFAULT_SETTINGS.suggestionCount)
          .default(DEFAULT_SETTINGS.suggestionCount),
        summaryViewedDate: z.union([luxonDateTimeSchema, z.null()]).default(null),
      })
      .default({...DEFAULT_SETTINGS}),
  });
};
