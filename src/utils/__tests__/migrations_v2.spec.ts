import {describe, it, expect} from 'vitest';
import {DateTime} from 'luxon';
import {DEFAULT_SETTINGS} from '@/utils/constants';
import {applyMigrations} from '@/utils/migrations';
import type {Week} from '@/types';

const thisWeek = DateTime.now().startOf('week');
const lastWeek = thisWeek.minus({weeks: 1});
const twoWeeksAgo = thisWeek.minus({weeks: 2});

describe('migration v2', () => {
  it('migrates sequential weeks with matching challenges', () => {
    const data = {
      'veggies-settings': {...DEFAULT_SETTINGS, migrationVersion: 1},
      'veggies-weeks': [
        {startDate: twoWeeksAgo, veggies: ['spinach']},
        {startDate: lastWeek, veggies: ['apple', 'banana']},
        {startDate: thisWeek, veggies: ['tomato', 'carrot']},
      ],
      'veggies-challenges': [
        {startDate: twoWeeksAgo, veggie: 'lettuce'},
        {startDate: lastWeek, veggie: 'orange'},
        {startDate: thisWeek, veggie: 'cucumber'},
      ],
    };

    const result = applyMigrations(data, 1, 2);

    const weeks = result['veggies-weeks'] as Week[];
    expect(weeks).toHaveLength(3);
    expect(weeks[0].challenge).toBe('lettuce');
    expect(weeks[1].challenge).toBe('orange');
    expect(weeks[2].challenge).toBe('cucumber');
    expect(result).not.toHaveProperty('veggies-challenges');
  });

  it('migrates weeks and challenges with gaps', () => {
    const data = {
      'veggies-settings': {...DEFAULT_SETTINGS, migrationVersion: 1},
      'veggies-weeks': [
        {startDate: twoWeeksAgo, veggies: ['spinach']},
        {startDate: thisWeek, veggies: ['tomato']},
      ],
      'veggies-challenges': [{startDate: twoWeeksAgo, veggie: 'lettuce'}],
    };

    const result = applyMigrations(data, 1, 2);

    const weeks = result['veggies-weeks'] as Week[];
    expect(weeks).toHaveLength(2);
    expect(weeks[0].challenge).toBe('lettuce');
    expect(weeks[1].challenge).toBeTruthy();
    expect(result).not.toHaveProperty('veggies-challenges');
  });

  it('migrates empty weeks array', () => {
    const data = {
      'veggies-settings': {...DEFAULT_SETTINGS, migrationVersion: 1},
      'veggies-weeks': [],
      'veggies-challenges': [],
    };

    const result = applyMigrations(data, 1, 2);

    expect(result['veggies-weeks']).toEqual([]);
    expect(result).not.toHaveProperty('veggies-challenges');
  });

  it('preserves existing challenge field in weeks', () => {
    const data = {
      'veggies-settings': {...DEFAULT_SETTINGS, migrationVersion: 1},
      'veggies-weeks': [
        {startDate: twoWeeksAgo, veggies: ['apple'], challenge: 'tomato'},
        {startDate: lastWeek, veggies: ['carrot'], challenge: 'lettuce'},
        {startDate: thisWeek, veggies: ['banana']},
      ],
      'veggies-challenges': [
        {startDate: twoWeeksAgo, veggie: 'cucumber'},
        {startDate: lastWeek, veggie: 'orange'},
        {startDate: thisWeek, veggie: 'spinach'},
      ],
    };

    const result = applyMigrations(data, 1, 2);
    const weeks = result['veggies-weeks'] as Week[];
    expect(weeks).toHaveLength(3);
    expect(weeks[0].challenge).toBe('tomato');
    expect(weeks[1].challenge).toBe('lettuce');
    expect(weeks[2].challenge).toBe('spinach');
    expect(result).not.toHaveProperty('veggies-challenges');
  });
});
