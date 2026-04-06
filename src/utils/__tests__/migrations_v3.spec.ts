import {describe, it, expect} from 'vitest';
import {DEFAULT_SETTINGS} from '@/utils/constants';
import {applyMigrations} from '@/utils/migrations';
import {getWeekStart} from '@/utils/helpers';

describe('migration v3: rename start-date key', () => {
  const thisWeek = getWeekStart();

  it('renames veggies-start-date to veggies-startDate', () => {
    const data = {
      settings: {...DEFAULT_SETTINGS, migrationVersion: 2},
      'start-date': thisWeek,
      weeks: [],
    };

    const result = applyMigrations(data, 2, 3);

    expect(result).not.toHaveProperty('start-date');
    expect(result.startDate).toEqual(thisWeek);
  });

  it('handles missing start-date key gracefully', () => {
    const data = {
      settings: {...DEFAULT_SETTINGS, migrationVersion: 2},
      weeks: [],
    };

    const result = applyMigrations(data, 2, 3);

    expect(result).not.toHaveProperty('start-date');
    expect(result).not.toHaveProperty('startDate');
  });

  it('preserves other data when renaming', () => {
    const data = {
      settings: {...DEFAULT_SETTINGS, migrationVersion: 2},
      'start-date': thisWeek,
      weeks: [{startDate: thisWeek, veggies: ['apple'], challenge: 'cucumber'}],
    };

    const result = applyMigrations(data, 2, 3);

    expect(result.settings).toEqual({...DEFAULT_SETTINGS, migrationVersion: 3});
    expect(result.weeks).toHaveLength(1);
    expect(result.startDate).toEqual(thisWeek);
    expect(result).not.toHaveProperty('start-date');
  });
});
