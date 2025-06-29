import {describe, it, expect} from 'vitest';
import {DateTime} from 'luxon';
import {unique} from 'remeda';
import {ALL_VEGGIES, DEFAULT_SETTINGS} from '@/utils/constants';
import {
  achievementLevelHelper,
  dateParser,
  dateReplacer,
  getCategoryForVeggie,
  getChartOptions,
  getImportSchema,
  getRandomEmojis,
  getRandomVeggie,
} from '@/utils/helpers';
import {AchievementLevel, Category, type Challenge} from '@/utils/types';

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

  it('returns random veggie', () => {
    const randomVeggies = [...Array(100)].map(() => getRandomVeggie(ALL_VEGGIES));
    randomVeggies.forEach((veggie) => expect(ALL_VEGGIES).toContain(veggie));
    expect(new Set(randomVeggies).size).toBeGreaterThan(70);
  });

  it('parses dates from JSON', () => {
    const parsed: Challenge[] = JSON.parse(
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

  it('combines chart configs', () => {
    const overrides = {
      responsive: false,
      layout: {
        padding: 10,
      },
      plugins: {
        legend: {
          display: true,
        },
      },
    };

    const result = getChartOptions<'bar'>(true, true, true, false, overrides);
    expect(result.responsive).toBe(false);
    expect(result.layout?.padding).toBe(10);
    expect(result.plugins?.legend?.display).toBe(true);
    // Defaults
    expect(result.maintainAspectRatio).toBe(false);
    expect(result.scales?.x?.stacked).toBe(true);
    expect(result.plugins?.datalabels?.anchor).toBe('center');
  });

  it('disables animations', () => {
    let result = getChartOptions<'bar'>(true, true, true, false);
    expect(result.animation).toBe(false);
    expect(result.plugins?.tooltip?.animation).toBe(false);
    result = getChartOptions<'bar'>(true, true, true, true);
    expect(result.animation).toBe(undefined);
    expect(result.plugins?.tooltip?.animation).toBe(true);
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

  it('validates startDates', () => {
    const faultyData = {
      startDate: null,
      weeks: [{veggies: [], startDate: null}],
      challenges: [{veggie: 'carrot', startDate: null}],
      settings: {
        ...DEFAULT_SETTINGS,
      },
    };

    const result = importSchema.safeParse(faultyData);
    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual([
      {
        code: 'custom',
        message: 'Invalid DateTime instance',
        path: ['startDate'],
      },
      {
        code: 'custom',
        message: 'Invalid DateTime instance',
        path: ['challenges', 0, 'startDate'],
      },
      {
        code: 'custom',
        message: 'Invalid DateTime instance',
        path: ['weeks', 0, 'startDate'],
      },
    ]);
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

  it('fails on missing week startDate', () => {
    const faultyData = {
      startDate: DateTime.now().startOf('week'),
      weeks: [
        {
          startDate: null,
          veggies: [],
        },
      ],
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
    expect(errorMessage[0].path).toEqual(['weeks', 0, 'startDate']);
  });

  it('fails on missing challenge startDate', () => {
    const faultyData = {
      startDate: DateTime.now().startOf('week'),
      weeks: [],
      challenges: [
        {
          startDate: null,
          veggie: 'apple',
        },
      ],
      settings: {
        ...DEFAULT_SETTINGS,
      },
    };
    const result = importSchema.safeParse(faultyData);
    expect(result.success).toBe(false);
    const errorMessage = JSON.parse(result.error?.message ?? '');
    expect(errorMessage.length).toEqual(1);
    expect(errorMessage[0].message).toEqual('Invalid DateTime instance');
    expect(errorMessage[0].path).toEqual(['challenges', 0, 'startDate']);
  });

  it('handles missing data', () => {
    const faultyData = {
      startDate: DateTime.now().startOf('week'),
    };
    const result = importSchema.safeParse(faultyData);
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      startDate: DateTime.now().startOf('week'),
      challenges: [],
      weeks: [],
      settings: {...DEFAULT_SETTINGS},
    });
  });

  it('handles extra data', () => {
    const faultyData = {
      startDate: DateTime.now().startOf('week'),
      weeks: [{startDate: DateTime.now().startOf('week'), veggies: ['apple'], foo: true}],
      challenges: [{startDate: DateTime.now().startOf('week'), veggie: 'apple', bar: true}],
      settings: {
        ...DEFAULT_SETTINGS,
        baz: true,
      },
    };
    const result = importSchema.safeParse(faultyData);
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      startDate: DateTime.now().startOf('week'),
      challenges: [{startDate: DateTime.now().startOf('week'), veggie: 'apple'}],
      weeks: [{startDate: DateTime.now().startOf('week'), veggies: ['apple']}],
      settings: {...DEFAULT_SETTINGS},
    });
  });

  it('handles wrong data', () => {
    const faultyData = {
      startDate: DateTime.now().startOf('week'),
      settings: {
        locale: 'el',
        suggestionCount: 100,
        showChartAnimations: 0,
      },
    };
    const result = importSchema.safeParse(faultyData);
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      startDate: DateTime.now().startOf('week'),
      challenges: [],
      weeks: [],
      settings: {...DEFAULT_SETTINGS},
    });
  });
});
