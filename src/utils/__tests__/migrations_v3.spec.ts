import {describe, it, expect} from 'vitest';
import {DateTime} from 'luxon';
import {DEFAULT_SETTINGS} from '@/utils/constants';
import {applyMigrations} from '@/utils/migrations';

const thisWeek = DateTime.now().startOf('week');

describe('migration v3: rename start-date key', () => {
  it('renames veggies-start-date to veggies-startDate', () => {
    const data = {
      'veggies-settings': {...DEFAULT_SETTINGS, migrationVersion: 2},
      'veggies-start-date': thisWeek,
      'veggies-weeks': [],
    };

    const result = applyMigrations(data, 2, 3);

    expect(result).toHaveProperty('veggies-startDate');
    expect(result).not.toHaveProperty('veggies-start-date');
    expect(result['veggies-startDate']).toEqual(thisWeek);
  });

  it('handles missing start-date key gracefully', () => {
    const data = {
      'veggies-settings': {...DEFAULT_SETTINGS, migrationVersion: 2},
      'veggies-weeks': [],
    };

    const result = applyMigrations(data, 2, 3);

    expect(result).not.toHaveProperty('veggies-start-date');
    expect(result).not.toHaveProperty('veggies-startDate');
  });

  it('preserves other data when renaming', () => {
    const data = {
      'veggies-settings': {...DEFAULT_SETTINGS, migrationVersion: 2},
      'veggies-start-date': thisWeek,
      'veggies-weeks': [{startDate: thisWeek, veggies: ['apple'], challenge: 'cucumber'}],
    };

    const result = applyMigrations(data, 2, 3);

    expect(result['veggies-settings']).toEqual({...DEFAULT_SETTINGS, migrationVersion: 2});
    expect(result['veggies-weeks']).toHaveLength(1);
    expect(result['veggies-startDate']).toEqual(thisWeek);
    expect(result).not.toHaveProperty('veggies-start-date');
  });
});
