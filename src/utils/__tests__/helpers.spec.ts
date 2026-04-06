import {describe, it, expect} from 'vitest';
import {ALL_VEGGIES} from '@/utils/veggieDetails';
import {CURRENT_MIGRATION_VERSION, DEFAULT_SETTINGS} from '@/utils/constants';
import {
  achievementLevelHelper,
  areDatesEqual,
  dateParser,
  getCategoryForVeggie,
  getImportSchema,
  getRandomEmojis,
  getRandomItem,
  getStorageKeys,
  getWeekStart,
  normalizeForSearch,
  setIntersection,
} from '@/utils/helpers';
import {AchievementLevel, Category, type Week} from '@/types';

const importSchema = await getImportSchema();

describe('helpers', () => {
  const thisWeek = getWeekStart();
  describe('getWeekStart', () => {
    it('returns Monday for a date mid-week', () => {
      expect(
        areDatesEqual(
          getWeekStart(Temporal.PlainDate.from('2025-01-15')),
          Temporal.PlainDate.from('2025-01-13'),
        ),
      ).toBe(true);
    });

    it('returns Monday for the end of the week', () => {
      expect(
        areDatesEqual(
          getWeekStart(Temporal.PlainDate.from('2025-01-19')),
          Temporal.PlainDate.from('2025-01-13'),
        ),
      ).toBe(true);
    });

    it('returns the same date for a Monday', () => {
      expect(
        areDatesEqual(
          getWeekStart(Temporal.PlainDate.from('2025-01-13')),
          Temporal.PlainDate.from('2025-01-13'),
        ),
      ).toBe(true);
    });

    it('defaults to this week', () => {
      const today = Temporal.Now.plainDateISO();
      expect(areDatesEqual(getWeekStart(), today.subtract({days: today.dayOfWeek - 1}))).toBe(true);
    });
  });

  describe('areDatesEqual', () => {
    it('returns true for equal dates', () => {
      expect(
        areDatesEqual(Temporal.PlainDate.from('2025-01-15'), Temporal.PlainDate.from('2025-01-15')),
      ).toBe(true);
    });

    it('returns false for dates in different years', () => {
      expect(
        areDatesEqual(Temporal.PlainDate.from('2024-01-15'), Temporal.PlainDate.from('2025-01-15')),
      ).toBe(false);
    });

    it('returns false for different dates in the same week', () => {
      expect(
        areDatesEqual(Temporal.PlainDate.from('2025-01-13'), Temporal.PlainDate.from('2025-01-19')),
      ).toBe(false);
    });
  });

  describe('getCategoryForVeggie', () => {
    it('returns correct veggie categories', () => {
      expect(getCategoryForVeggie('onion')).toBe(Category.Root);
      expect(getCategoryForVeggie('watermelon')).toBe(Category.Fruit);
      expect(getCategoryForVeggie('endive')).toBe(Category.Leafy);
      expect(getCategoryForVeggie('cucumber')).toBe(Category.Vegetable);
      expect(getCategoryForVeggie('fava bean')).toBe(Category.Bean);
      expect(getCategoryForVeggie('rye')).toBe(Category.Grain);
      expect(getCategoryForVeggie('shiitake')).toBe(Category.Mushroom);
    });

    it('returns undefined for unknown veggies', () => {
      expect(getCategoryForVeggie('unknown veggie')).toBeUndefined();
    });
  });

  describe('getRandomItem', () => {
    it('returns random item', () => {
      const randomVeggies = [...Array(100)].map(() => getRandomItem(ALL_VEGGIES));
      randomVeggies.forEach((veggie) => expect(ALL_VEGGIES).toContain(veggie));
      expect(new Set(randomVeggies).size).toBeGreaterThan(70);
    });

    it('returns undefined for empty arrays', () => {
      expect(getRandomItem([])).toBeUndefined();
    });
  });

  describe('setIntersection', () => {
    it('returns items from array that are in the set', () => {
      const set = new Set(['a', 'b', 'c']);
      expect(setIntersection(set, ['a', 'x', 'b', 'y', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('returns empty array when no items match', () => {
      const set = new Set(['a', 'b']);
      expect(setIntersection(set, ['x', 'y', 'z'])).toEqual([]);
    });

    it('returns full array when all items are in set', () => {
      const set = new Set([1, 2, 3]);
      expect(setIntersection(set, [1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('preserves order of the input array', () => {
      const set = new Set(['c', 'a', 'b']);
      expect(setIntersection(set, ['z', 'a', 'y', 'b', 'x', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('handles empty set', () => {
      const set = new Set<string>();
      expect(setIntersection(set, ['a', 'b', 'c'])).toEqual([]);
    });

    it('handles empty array', () => {
      const set = new Set(['a', 'b', 'c']);
      expect(setIntersection(set, [])).toEqual([]);
    });

    it('works with two sets', () => {
      const set1 = new Set(['a', 'b', 'c']);
      const set2 = new Set(['b', 'c', 'd']);
      expect(setIntersection(set1, set2)).toEqual(['b', 'c']);
    });
  });

  describe('getStorageKeys', () => {
    it('gets all veggies-prefixed localStorage keys', () => {
      localStorage.setItem('veggies-startDate', thisWeek.toString());
      localStorage.setItem('veggies-settings', JSON.stringify({...DEFAULT_SETTINGS}));
      localStorage.setItem('veggies-weeks', JSON.stringify([]));
      localStorage.setItem('other-data', 'should not be included');

      const keys = getStorageKeys();

      expect(keys).toHaveLength(3);
      expect(keys).toContain('veggies-startDate');
      expect(keys).toContain('veggies-settings');
      expect(keys).toContain('veggies-weeks');
      expect(keys).not.toContain('other-data');
    });

    it('returns empty array when localStorage is empty', () => {
      const keys = getStorageKeys();

      expect(keys).toEqual([]);
    });
  });

  describe('dateParser', () => {
    it('parses dates from JSON', () => {
      const parsed: Week[] = JSON.parse(
        '[{"startDate":"2024-09-02","veggies":["nectarine","apple"],"challenge":"nectarine"},{"startDate":"2024-09-16","veggies":["kale","spinach"],"challenge":"kale"},{"startDate":"2024-09-23","veggies":["cucumber","tomato"],"challenge":"cucumber"}]',
        dateParser,
      );
      expect(parsed.length).toBe(3);
      expect(parsed[0].veggies).toEqual(['nectarine', 'apple']);
      expect(parsed[0].challenge).toBe('nectarine');
      expect(areDatesEqual(parsed[0].startDate, Temporal.PlainDate.from('2024-09-02'))).toBe(true);
      expect(parsed[1].veggies).toEqual(['kale', 'spinach']);
      expect(parsed[1].challenge).toBe('kale');
      expect(areDatesEqual(parsed[1].startDate, Temporal.PlainDate.from('2024-09-16'))).toBe(true);
      expect(parsed[2].veggies).toEqual(['cucumber', 'tomato']);
      expect(parsed[2].challenge).toBe('cucumber');
      expect(areDatesEqual(parsed[2].startDate, Temporal.PlainDate.from('2024-09-23'))).toBe(true);
    });

    it('parses numbers as they are', () => {
      const parsed: {foo: number; bar: number} = JSON.parse('{"foo": 1, "bar": 2}', dateParser);
      expect(parsed).toEqual({foo: 1, bar: 2});
    });

    it('parses null dates correctly', () => {
      const parsed: {summaryViewedDate: Temporal.PlainDate | null} = JSON.parse(
        '{"summaryViewedDate": null}',
        dateParser,
      );
      expect(parsed.summaryViewedDate).toBeNull();
    });
  });

  describe('getRandomEmojis', () => {
    it('gives unique emojis', () => {
      const emojis = getRandomEmojis(15);
      expect(new Set(emojis)).toHaveLength(15);
    });
  });

  describe('normalizeForSearch', () => {
    it('normalizes text for search', () => {
      expect(normalizeForSearch('frisée')).toBe('frisee');
      expect(normalizeForSearch('machê')).toBe('mache');
      expect(normalizeForSearch('kookospähkinä')).toBe('kookospähkinä');
      expect(normalizeForSearch('blood grapefruit')).toBe('bloodgrapefruit');
    });
  });

  describe('achievementLevelHelper', () => {
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
  });

  describe('getImportSchema', () => {
    it('fails on missing startDate', () => {
      const faultyData = {
        weeks: [],
        challenges: [],
        settings: {
          ...DEFAULT_SETTINGS,
          startDate: null,
        },
      };
      const result = importSchema.safeParse(faultyData);
      expect(result.success).toBe(false);
      const errorMessage = JSON.parse(result.error?.message ?? '');
      expect(errorMessage.length).toEqual(1);
      expect(errorMessage[0].message).toEqual('Invalid Temporal.PlainDate instance');
      expect(errorMessage[0].path).toEqual(['settings', 'startDate']);
    });

    it('fails on missing week data', () => {
      const faultyData = {
        weeks: [
          {
            startDate: null,
            veggies: [],
          },
        ],
        settings: {
          ...DEFAULT_SETTINGS,
          startDate: thisWeek,
        },
      };
      const result = importSchema.safeParse(faultyData);
      expect(result.success).toBe(false);
      const errorMessage = JSON.parse(result.error?.message ?? '');
      expect(errorMessage.length).toEqual(2);
      expect(errorMessage[0].message).toEqual('Invalid Temporal.PlainDate instance');
      expect(errorMessage[0].path).toEqual(['weeks', 0, 'startDate']);
      expect(errorMessage[1].message).toEqual('Invalid input: expected string, received undefined');
      expect(errorMessage[1].path).toEqual(['weeks', 0, 'challenge']);
    });

    it('handles missing data', () => {
      const faultyData = {
        settings: {
          startDate: thisWeek,
          migrationVersion: CURRENT_MIGRATION_VERSION,
        },
      };
      const result = importSchema.safeParse(faultyData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        weeks: [],
        settings: {...DEFAULT_SETTINGS, startDate: thisWeek},
      });
    });

    it('handles extra data', () => {
      const faultyData = {
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
          startDate: thisWeek,
          baz: true,
        },
      };
      const result = importSchema.safeParse(faultyData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        weeks: [{startDate: thisWeek, veggies: ['apple'], challenge: 'cucumber'}],
        settings: {...DEFAULT_SETTINGS, startDate: thisWeek},
      });
    });

    it('handles wrong data', () => {
      const faultyData = {
        settings: {
          startDate: thisWeek,
          locale: 'el',
          suggestionCount: 100,
          showChartAnimations: 0,
          migrationVersion: CURRENT_MIGRATION_VERSION,
        },
      };
      const result = importSchema.safeParse(faultyData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        weeks: [],
        settings: {
          ...DEFAULT_SETTINGS,
          startDate: thisWeek,
          migrationVersion: CURRENT_MIGRATION_VERSION,
        },
      });
    });
  });
});
