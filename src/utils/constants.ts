import type {InjectionKey, Ref} from 'vue';
import type {DateTime} from 'luxon';
import type {UseMemoizeReturn} from '@vueuse/core';
import {Category, type Locale, type Settings} from '@/types';

export const APP_URL = 'https://eatyourveggies.app';

export const BLUESKY_URL = 'https://bsky.app/profile/eatyourveggies.app';

export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=app.eatyourveggies.twa';

export const BUILD_TIME = __VITE_BUILD_TIME__;

export const MINIMUM_MIGRATION_VERSION = 1;
export const CURRENT_MIGRATION_VERSION = 4;

export const DEFAULT_LOCALE: Locale = 'en';

export const DEFAULT_SETTINGS = {
  allergens: [] as string[],
  locale: DEFAULT_LOCALE,
  migrationVersion: CURRENT_MIGRATION_VERSION,
  showChartAnimations: true,
  startDate: null as DateTime | null,
  suggestionCount: 10,
  summaryViewedDate: null as DateTime | null,
} as const satisfies Settings;

export const KEYS = {
  challenge: Symbol() as InjectionKey<Ref<string | undefined>>,
  dropdownStyles: Symbol() as InjectionKey<
    UseMemoizeReturn<string, [active: boolean, selected: boolean]>
  >,
} as const;

export const LOCALES: readonly Locale[] = ['en', 'fi'] as const;

export const COLORS = {
  chartColors: ['#f0f9ff', '#bae6fd', '#38bdf8', '#0284c7', '#075985', '#082f49', '#0B1623'],
  chartColorsAlternate: [
    '#fdc5f5',
    '#f7aef8',
    '#b388eb',
    '#8093f1',
    '#79b8f4',
    '#72ddf7',
    '#bae6fd',
  ],
} as const;

export const CATEGORY_EMOJI = {
  [Category.Fruit]: '🍎',
  [Category.Vegetable]: '🥦',
  [Category.Leafy]: '🥬',
  [Category.Root]: '🥕',
  [Category.Bean]: '🫛',
  [Category.Grain]: '🌾',
  [Category.Mushroom]: '🍄‍🟫',
} as const;
