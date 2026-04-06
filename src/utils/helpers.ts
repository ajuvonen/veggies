import {useMemoize} from '@vueuse/core';
import {sample} from 'remeda';
import {BEANS, FRUITS, GRAINS, LEAFIES, MUSHROOMS, ROOTS, VEGETABLES} from '@/utils/veggieDetails';
import {CURRENT_MIGRATION_VERSION, DEFAULT_SETTINGS, LOCALES} from '@/utils/constants';
import {AchievementLevel, Category} from '@/types';

export const areDatesEqual = (a: Temporal.PlainDate, b: Temporal.PlainDate) =>
  Temporal.PlainDate.compare(a, b) === 0;

export const getWeekStart = (
  date: Temporal.PlainDate = Temporal.Now.plainDateISO(),
): Temporal.PlainDate => date.subtract({days: date.dayOfWeek - 1});

export const getCategoryForVeggie = useMemoize((veggie: string) => {
  if (FRUITS.has(veggie)) {
    return Category.Fruit;
  } else if (VEGETABLES.has(veggie)) {
    return Category.Vegetable;
  } else if (LEAFIES.has(veggie)) {
    return Category.Leafy;
  } else if (ROOTS.has(veggie)) {
    return Category.Root;
  } else if (BEANS.has(veggie)) {
    return Category.Bean;
  } else if (GRAINS.has(veggie)) {
    return Category.Grain;
  } else if (MUSHROOMS.has(veggie)) {
    return Category.Mushroom;
  }
  return undefined;
});

export const getRandomItem = <T>(availableItems: readonly T[] = []): T | undefined =>
  availableItems[Math.floor(Math.random() * availableItems.length)];

export const setIntersection = <T>(set: ReadonlySet<T>, collection: Iterable<T>): T[] =>
  [...collection].filter((item) => set.has(item));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dateParser = (key: string, value: any) => {
  if (key.endsWith('Date') && value) {
    return Temporal.PlainDate.from(value);
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
  const plainDateSchema = z.custom<Temporal.PlainDate>(
    (val) => val instanceof Temporal.PlainDate,
    'Invalid Temporal.PlainDate instance',
  );
  return z.object({
    weeks: z._default(
      z.array(
        z.object({
          startDate: plainDateSchema,
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
      showVeggieFacts: z._default(
        z.catch(z.boolean(), DEFAULT_SETTINGS.showVeggieFacts),
        DEFAULT_SETTINGS.showVeggieFacts,
      ),
      startDate: plainDateSchema,
      suggestionCount: z._default(
        z.catch(
          z.number().check(z.refine((val) => [0, 5, 10, 15, 20].includes(val))),
          DEFAULT_SETTINGS.suggestionCount,
        ),
        DEFAULT_SETTINGS.suggestionCount,
      ),
      summaryViewedDate: z._default(
        z.nullable(plainDateSchema),
        DEFAULT_SETTINGS.summaryViewedDate,
      ),
    }),
  });
};
