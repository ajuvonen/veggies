import type {InjectionKey, Ref} from 'vue';
import {Category, type Locale, type Settings, type WeeklyAchievements} from '@/types';

export const APP_URL = 'https://eatyourveggies.app';

export const AI_SUMMARY_URL = 'https://veggies-api.ajuvonen.workers.dev/summarize';

export const BLUESKY_URL = 'https://bsky.app/profile/eatyourveggies.app';

export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=app.eatyourveggies.twa';

export const BUILD_TIME = __VITE_BUILD_TIME__;

export const MINIMUM_MIGRATION_VERSION = 1;
export const CURRENT_MIGRATION_VERSION = 4;

export const DEFAULT_LOCALE = 'en' as const satisfies Locale;

export const DEFAULT_SETTINGS: Settings = {
  AIAllowed: null,
  allergens: [] as string[],
  locale: DEFAULT_LOCALE,
  migrationVersion: CURRENT_MIGRATION_VERSION,
  showChartAnimations: true,
  showVeggieFacts: true,
  startDate: null,
  suggestionCount: 10,
  summaryViewedDate: null,
};

export const KEYS = {
  challenge: Symbol() as InjectionKey<Ref<string | undefined>>,
} as const;

export const LOCALES = ['en', 'fi'] as const satisfies ReadonlyArray<Locale>;

export const WEEKLY_ACHIEVEMENT_EMOJI = {
  allOnRed: '♥️',
  botanicalBerries: '🍅',
  goNuts: '🥜',
  lemons: '🍋',
  overachiever: '💪',
  rainbow: '🌈',
  tearnado: '🧅',
  thirtyVeggies: '🎉',
} as const satisfies Record<keyof WeeklyAchievements, string>;

export const CHART_COLORS = [
  '#0c3d66',
  '#075985',
  '#0369a1',
  '#0284c7',
  '#0ea5e9',
  '#38bdf8',
  '#7dd3fc',
] as const;

export const CATEGORY_EMOJI = {
  [Category.Fruit]: '🍎',
  [Category.Vegetable]: '🥦',
  [Category.Leafy]: '🥬',
  [Category.Root]: '🥕',
  [Category.Bean]: '🫛',
  [Category.Grain]: '🌾',
  [Category.Mushroom]: '🍄‍🟫',
} as const;
