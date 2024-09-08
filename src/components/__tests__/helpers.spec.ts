import {describe, it, expect} from 'vitest';
import {DateTime} from 'luxon';
import {ALL_VEGGIES} from '@/utils/constants';
import {dateParser, getCategoryForVeggie, getRandomVeggie} from '@/utils/helpers';
import {Category, type Challenge} from '@/utils/types';

describe('helpers', () => {
  it('returns correct veggie categories', () => {
    expect(getCategoryForVeggie('onion')).toBe(Category.Root);
    expect(getCategoryForVeggie('watermelon')).toBe(Category.Fruit);
    expect(getCategoryForVeggie('endive')).toBe(Category.Leafy);
    expect(getCategoryForVeggie('cucumber')).toBe(Category.Vegetable);
    expect(getCategoryForVeggie('adzuki bean')).toBe(Category.Bean);
    expect(getCategoryForVeggie('rye')).toBe(Category.Grain);
  });

  it('returns random veggie', () => {
    const randomVeggies = [...Array(100)].map(() => getRandomVeggie());
    randomVeggies.forEach((veggie) => expect(ALL_VEGGIES).toContain(veggie));
    expect(new Set(randomVeggies).size).toBeGreaterThan(70);
  });

  it('parses dates from JSON', () => {
    const parsed: Challenge[] = JSON.parse(
      '[{"startDate":"2024-09-02T00:00:00.000+03:00","veggie":"nectarine"}]',
      dateParser,
    );
    expect(parsed.length).toBe(1);
    expect(parsed[0].veggie).toBe('nectarine');
    expect(parsed[0].startDate).toBeInstanceOf(DateTime);
    expect(parsed[0].startDate.toISO()).toBe('2024-09-02T00:00:00.000+03:00');
  });

  it('parses numbers as they are', () => {
    const parsed: {foo: number; bar: number} = JSON.parse('{"foo": 1, "bar": 2}', dateParser);
    expect(parsed).toEqual({foo: 1, bar: 2});
  });
});
