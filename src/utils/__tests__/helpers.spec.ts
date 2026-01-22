import {describe, it, expect} from 'vitest';
import {DateTime} from 'luxon';
import {unique} from 'remeda';
import {ALL_VEGGIES, NUTRIENTS} from '@/utils/veggieDetails';
import {CURRENT_MIGRATION_VERSION, DEFAULT_SETTINGS} from '@/utils/constants';
import {
  achievementLevelHelper,
  dateParser,
  dateReplacer,
  getCategoryForVeggie,
  getImportSchema,
  getRandomEmojis,
  getRandomItem,
  getStorageKeys,
} from '@/utils/helpers';
import {AchievementLevel, Category} from '@/types';

const thisWeek = DateTime.now().startOf('week');
const importSchema = await getImportSchema();

describe('helpers', () => {
  it('returns correct veggie categories', () => {
    expect(getCategoryForVeggie('onion')).toBe(Category.Root);
    expect(getCategoryForVeggie('watermelon')).toBe(Category.Fruit);
    expect(getCategoryForVeggie('endive')).toBe(Category.Leafy);
    expect(getCategoryForVeggie('cucumber')).toBe(Category.Vegetable);
    expect(getCategoryForVeggie('fava bean')).toBe(Category.Bean);
    expect(getCategoryForVeggie('rye')).toBe(Category.Grain);
    expect(getCategoryForVeggie('shiitake')).toBe(Category.Mushroom);
    expect(getCategoryForVeggie('split pea')).toBe(undefined);
  });

  it('returns random item', () => {
    const randomVeggies = [...Array(100)].map(() => getRandomItem(ALL_VEGGIES));
    randomVeggies.forEach((veggie) => expect(ALL_VEGGIES).toContain(veggie));
    expect(new Set(randomVeggies).size).toBeGreaterThan(70);
  });

  it('returns undefined for empty arrays', () => {
    expect(getRandomItem([])).toBeUndefined();
  });

  it('gets all veggies-prefixed localStorage keys', () => {
    localStorage.setItem('veggies-settings', 'data1');
    localStorage.setItem('veggies-weeks', 'data2');
    localStorage.setItem('veggies-challenges', 'data3');
    localStorage.setItem('other-data', 'should not be included');

    const keys = getStorageKeys();

    expect(keys).toHaveLength(3);
    expect(keys).toContain('veggies-settings');
    expect(keys).toContain('veggies-weeks');
    expect(keys).toContain('veggies-challenges');
    expect(keys).not.toContain('other-data');
  });

  it('returns empty array when localStorage is empty', () => {
    const keys = getStorageKeys();

    expect(keys).toEqual([]);
  });

  it('parses dates from JSON', () => {
    const parsed: {startDate: DateTime; veggie: string}[] = JSON.parse(
      '[{"startDate":"2024-09-02T00:00:00.000Z","veggie":"nectarine"},{"startDate":"2024-09-16T22:00:00.000+14:00","veggie":"kale"},{"startDate":"2024-09-23T11:00:00.000-12:00","veggie":"cucumber"}]',
      dateParser,
    );
    expect(parsed.length).toBe(3);
    expect(parsed[0].veggie).toBe('nectarine');
    expect(parsed[0].startDate).toBeInstanceOf(DateTime);
    expect(parsed[0].startDate).toEqual(DateTime.fromISO('2024-09-02'));
    expect(parsed[1].veggie).toBe('kale');
    expect(parsed[1].startDate).toBeInstanceOf(DateTime);
    expect(parsed[1].startDate).toEqual(DateTime.fromISO('2024-09-16'));
    expect(parsed[2].veggie).toBe('cucumber');
    expect(parsed[2].startDate).toBeInstanceOf(DateTime);
    expect(parsed[2].startDate).toEqual(DateTime.fromISO('2024-09-23'));
  });

  it('parses numbers as they are', () => {
    const parsed: {foo: number; bar: number} = JSON.parse('{"foo": 1, "bar": 2}', dateParser);
    expect(parsed).toEqual({foo: 1, bar: 2});
  });

  it('stringifies only date part', () => {
    const testData = {
      startDate: DateTime.fromISO('2024-09-02T00:00:00.000Z'),
      veggies: ['nectarine', 'kale'],
    };

    const stringified = JSON.stringify(testData, dateReplacer);
    expect(stringified).toBe('{"startDate":"2024-09-02","veggies":["nectarine","kale"]}');
  });

  it('gives unique emojis', () => {
    const emojis = getRandomEmojis(15);
    expect(unique(emojis)).toHaveLength(15);
  });

  it('returns correct achievement levels', () => {
    const levels: [number, AchievementLevel][] = [
      [40, AchievementLevel.Platinum],
      [30, AchievementLevel.Gold],
      [20, AchievementLevel.Silver],
      [10, AchievementLevel.Bronze],
    ];
    expect(achievementLevelHelper(levels, 9)).toBe(AchievementLevel.NoAchievement);
    expect(achievementLevelHelper(levels, 10)).toBe(AchievementLevel.Bronze);
    expect(achievementLevelHelper(levels, 19)).toBe(AchievementLevel.Bronze);
    expect(achievementLevelHelper(levels, 20)).toBe(AchievementLevel.Silver);
    expect(achievementLevelHelper(levels, 29)).toBe(AchievementLevel.Silver);
    expect(achievementLevelHelper(levels, 30)).toBe(AchievementLevel.Gold);
    expect(achievementLevelHelper(levels, 40)).toBe(AchievementLevel.Platinum);
    expect(achievementLevelHelper(levels, 41)).toBe(AchievementLevel.Platinum);
  });

  it('fails on missing startDate', () => {
    const faultyData = {
      startDate: null,
      weeks: [],
      challenges: [],
      settings: {
        ...DEFAULT_SETTINGS,
      },
    };
    const result = importSchema.safeParse(faultyData);
    expect(result.success).toBe(false);
    const errorMessage = JSON.parse(result.error?.message ?? '');
    expect(errorMessage.length).toEqual(1);
    expect(errorMessage[0].message).toEqual('Invalid DateTime instance');
    expect(errorMessage[0].path).toEqual(['startDate']);
  });

  it('fails on missing week data', () => {
    const faultyData = {
      startDate: thisWeek,
      weeks: [
        {
          startDate: null,
          veggies: [],
        },
      ],
      settings: {
        ...DEFAULT_SETTINGS,
      },
    };
    const result = importSchema.safeParse(faultyData);
    expect(result.success).toBe(false);
    const errorMessage = JSON.parse(result.error?.message ?? '');
    expect(errorMessage.length).toEqual(2);
    expect(errorMessage[0].message).toEqual('Invalid DateTime instance');
    expect(errorMessage[0].path).toEqual(['weeks', 0, 'startDate']);
    expect(errorMessage[1].message).toEqual('Invalid input: expected string, received undefined');
    expect(errorMessage[1].path).toEqual(['weeks', 0, 'challenge']);
  });

  it('handles missing data', () => {
    const faultyData = {
      startDate: thisWeek,
    };
    const result = importSchema.safeParse(faultyData);
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      startDate: thisWeek,
      weeks: [],
      settings: {...DEFAULT_SETTINGS},
    });
  });

  it('handles extra data', () => {
    const faultyData = {
      startDate: thisWeek,
      weeks: [
        {
          startDate: thisWeek,
          veggies: ['apple'],
          challenge: 'cucumber',
          foo: true,
        },
      ],
      settings: {
        ...DEFAULT_SETTINGS,
        baz: true,
      },
    };
    const result = importSchema.safeParse(faultyData);
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      startDate: thisWeek,
      weeks: [{startDate: thisWeek, veggies: ['apple'], challenge: 'cucumber'}],
      settings: {...DEFAULT_SETTINGS},
    });
  });

  it('handles wrong data', () => {
    const faultyData = {
      startDate: thisWeek,
      settings: {
        locale: 'el',
        suggestionCount: 100,
        showChartAnimations: 0,
      },
    };
    const result = importSchema.safeParse(faultyData);
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      startDate: thisWeek,
      weeks: [],
      settings: {...DEFAULT_SETTINGS, migrationVersion: CURRENT_MIGRATION_VERSION},
    });
  });

  it.each(Object.keys(NUTRIENTS))('existing veggies in nutrient %s', (nutrient) => {
    const veggies = NUTRIENTS[nutrient as keyof typeof NUTRIENTS];
    veggies.forEach((veggie) => {
      expect.soft(ALL_VEGGIES).toContain(veggie);
    });
  });
});
