import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import {useI18n, type Composer, type VueMessageType} from 'vue-i18n';
import type {DateTimeFormat, LocaleMessage, NumberFormat} from '@intlify/core-base';
import {unique} from 'remeda';
import {ALL_VEGGIES} from '@/utils/constants';
import {
  achievementLevelHelper,
  dateParser,
  getCategoryForVeggie,
  getChartOptions,
  getRandomEmojis,
  getRandomVeggie,
} from '@/utils/helpers';
import {AchievementLevel, Category, type Challenge} from '@/utils/types';

const mountLocalization = () =>
  new Promise<
    Composer<
      {
        [x: string]: LocaleMessage<VueMessageType>;
      },
      {
        [x: string]: DateTimeFormat;
      },
      {
        [x: string]: NumberFormat;
      },
      string,
      string,
      string
    >
  >((resolve) => {
    mount({
      shallow: true,
      template: '<div />',
      setup() {
        resolve(useI18n());
      },
    });
  });

describe('helpers', () => {
  it('has translation for all veggies', async () => {
    const {t, tm} = await mountLocalization();
    ALL_VEGGIES.forEach((veggie) =>
      expect.soft(t(`veggies.${veggie}`)).not.toBe(`veggies.${veggie}`),
    );
    expect(Object.keys(tm('veggies')).length).toEqual(ALL_VEGGIES.length);
  });

  it.skip('has facts for all veggies', async () => {
    const {tm} = await mountLocalization();
    ALL_VEGGIES.forEach((veggie) => {
      if (!tm(`facts.${veggie}`).length) console.log(veggie);
      expect.soft(tm(`facts.${veggie}`).length).toBeGreaterThan(0);
    });
    expect(Object.keys(tm('facts')).length).toEqual(ALL_VEGGIES.length);
  });

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
    const randomVeggies = [...Array(100)].map(() => getRandomVeggie());
    randomVeggies.forEach((veggie) => expect(ALL_VEGGIES).toContain(veggie));
    expect(new Set(randomVeggies).size).toBeGreaterThan(70);
  });

  it('parses dates from JSON', () => {
    const parsed: Challenge[] = JSON.parse(
      '[{"startDate":"2024-09-02T00:00:00.000Z","veggie":"nectarine"},{"startDate":"2024-09-16T00:00:00.000+14:00","veggie":"kale"},{"startDate":"2024-09-23T00:00:00.000-12:00","veggie":"cucumber"}]',
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
});
