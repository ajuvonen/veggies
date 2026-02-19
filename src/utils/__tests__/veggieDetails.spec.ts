import {describe, it, expect} from 'vitest';
import {
  ALL_VEGGIES,
  BOTANICAL_BERRIES,
  CITRUSES,
  NUTRIENTS,
  NUTS,
  ONIONS,
  RED_VEGGIES,
} from '@/utils/veggieDetails';

describe('veggieDetails', () => {
  it('all CITRUSES are in ALL_VEGGIES', () => {
    CITRUSES.forEach((veggie) => {
      expect.soft(ALL_VEGGIES).toContain(veggie);
    });
  });

  it('all RED_VEGGIES are in ALL_VEGGIES', () => {
    RED_VEGGIES.forEach((veggie) => {
      expect.soft(ALL_VEGGIES).toContain(veggie);
    });
  });

  it('all NUTS are in ALL_VEGGIES', () => {
    NUTS.forEach((veggie) => {
      expect.soft(ALL_VEGGIES).toContain(veggie);
    });
  });

  it('all BOTANICAL_BERRIES are in ALL_VEGGIES', () => {
    BOTANICAL_BERRIES.forEach((veggie) => {
      expect.soft(ALL_VEGGIES).toContain(veggie);
    });
  });

  it('all ONIONS are in ALL_VEGGIES', () => {
    ONIONS.forEach((veggie) => {
      expect.soft(ALL_VEGGIES).toContain(veggie);
    });
  });

  it.each(Object.keys(NUTRIENTS))('all veggies in NUTRIENTS.%s are in ALL_VEGGIES', (nutrient) => {
    const veggies = NUTRIENTS[nutrient as keyof typeof NUTRIENTS];
    veggies.forEach((veggie) => {
      expect.soft(ALL_VEGGIES).toContain(veggie);
    });
  });
});
