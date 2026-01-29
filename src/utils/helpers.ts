import {useMemoize} from '@vueuse/core';
import {DateTime} from 'luxon';
import {sample} from 'remeda';
import {BEANS, FRUITS, GRAINS, LEAFIES, MUSHROOMS, ROOTS, VEGETABLES} from '@/utils/veggieDetails';
import {CURRENT_MIGRATION_VERSION, DEFAULT_SETTINGS, LOCALES} from '@/utils/constants';
import {AchievementLevel, Category} from '@/types';

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

export const normalizeForSearch = useMemoize((text: string): string => {
  return (
    text
      .toLowerCase()
      .normalize('NFD')
      // Remove combining marks except U+0308 (diaeresis/umlaut)
      .replace(/[\u0300-\u0307\u0309-\u036f]/g, '')
      .normalize('NFC')
      .replace(/\s+/g, '')
  );
});

export const getStorageKeys = (): string[] => {
  const keys: string[] = [];
  Array.from({length: localStorage.length}).forEach((_, index) => {
    const key = localStorage.key(index);
    if (key?.startsWith('veggies-')) {
      keys.push(key);
    }
  });
  return keys;
};

export const getImportSchema = async () => {
  const z = await import('zod/mini');
  z.config(z.locales.en());
  const luxonDateTimeSchema = z.custom<DateTime<true>>(
    (val) => val instanceof DateTime && val.isValid,
    'Invalid DateTime instance',
  );
  return z.object({
    weeks: z._default(
      z.array(
        z.object({
          startDate: luxonDateTimeSchema,
          veggies: z.array(z.string()),
          challenge: z.string(),
        }),
      ),
      () => [],
    ),
    settings: z.object({
      allergens: z._default(
        z.catch(z.array(z.string()), () => DEFAULT_SETTINGS.allergens),
        () => DEFAULT_SETTINGS.allergens,
      ),
      locale: z._default(
        z.catch(z.enum(LOCALES), DEFAULT_SETTINGS.locale),
        DEFAULT_SETTINGS.locale,
      ),
      migrationVersion: z.literal(CURRENT_MIGRATION_VERSION),
      showChartAnimations: z._default(
        z.catch(z.boolean(), DEFAULT_SETTINGS.showChartAnimations),
        DEFAULT_SETTINGS.showChartAnimations,
      ),
      startDate: luxonDateTimeSchema,
      suggestionCount: z._default(
        z.catch(
          z.number().check(z.refine((val) => [0, 5, 10, 15, 20].includes(val))),
          DEFAULT_SETTINGS.suggestionCount,
        ),
        DEFAULT_SETTINGS.suggestionCount,
      ),
      summaryViewedDate: z._default(
        z.nullable(luxonDateTimeSchema),
        DEFAULT_SETTINGS.summaryViewedDate,
      ),
    }),
  });
};
