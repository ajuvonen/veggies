import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import {useI18n, type Composer, type VueMessageType} from 'vue-i18n';
import type {DateTimeFormat, LocaleMessage, NumberFormat} from '@intlify/core-base';
import {unique} from 'remeda';
import {ALL_VEGGIES} from '@/utils/constants';
import {dateParser, getCategoryForVeggie, getRandomEmojis, getRandomVeggie} from '@/utils/helpers';
import {Category, type Challenge} from '@/utils/types';

describe('helpers', () => {
  it('has translation for all veggies', async () => {
    const {t, tm} = await new Promise<
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
    ALL_VEGGIES.forEach((veggie) => expect(t(`veggies.${veggie}`)).not.toBe(`veggies.${veggie}`));
    expect(Object.keys(tm('veggies')).length).toEqual(ALL_VEGGIES.length);
  });

  it('returns correct veggie categories', () => {
    expect(getCategoryForVeggie('onion')).toBe(Category.Root);
    expect(getCategoryForVeggie('watermelon')).toBe(Category.Fruit);
    expect(getCategoryForVeggie('endive')).toBe(Category.Leafy);
    expect(getCategoryForVeggie('cucumber')).toBe(Category.Vegetable);
    expect(getCategoryForVeggie('fava bean')).toBe(Category.Bean);
    expect(getCategoryForVeggie('rye')).toBe(Category.Grain);
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
});
