import {describe, it, expect} from 'vitest';
import {DateTime} from 'luxon';
import {applyMigrations} from '@/utils/migrations';
import type {Week} from '@/types';

const thisWeek = DateTime.now().startOf('week');

// v3 settings structure (before startDate was moved into settings)
const settingsV3 = {
  allergens: [],
  locale: 'en' as const,
  migrationVersion: 3,
  showChartAnimations: true,
  suggestionCount: 10,
  summaryViewedDate: null,
};

describe('migration v4: move startDate to settings', () => {
  it('moves startDate from root to settings', () => {
    const data = {
      settings: {...settingsV3},
      startDate: thisWeek,
      weeks: [],
    };

    const result = applyMigrations(data, 3, 4);

    expect(result).not.toHaveProperty('startDate');
    expect(result.settings).toHaveProperty('startDate');
    expect((result.settings as Record<string, unknown>).startDate).toEqual(thisWeek);
  });

  it('handles null startDate', () => {
    const data = {
      settings: {...settingsV3},
      startDate: null,
      weeks: [],
    };

    const result = applyMigrations(data, 3, 4);

    expect(result).not.toHaveProperty('startDate');
    expect((result.settings as Record<string, unknown>).startDate).toBeNull();
  });

  it('preserves other data', () => {
    const data = {
      settings: {
        allergens: ['peanut', 'soy'],
        locale: 'fi' as const,
        migrationVersion: 3,
        showChartAnimations: false,
        suggestionCount: 15,
        summaryViewedDate: thisWeek,
      },
      startDate: thisWeek,
      weeks: [{startDate: thisWeek, veggies: ['apple', 'banana'], challenge: 'tomato'}],
    };

    const result = applyMigrations(data, 3, 4);

    expect(result).not.toHaveProperty('startDate');
    const settings = result.settings as Record<string, unknown>;
    expect(settings.allergens).toEqual(['peanut', 'soy']);
    expect(settings.locale).toBe('fi');
    expect(settings.showChartAnimations).toBe(false);
    expect(settings.suggestionCount).toBe(15);
    expect(settings.summaryViewedDate).toEqual(thisWeek);
    expect(settings.startDate).toEqual(thisWeek);
    expect(settings.migrationVersion).toBe(4);

    const weeks = result.weeks as Week[];
    expect(weeks).toHaveLength(1);
    expect(weeks[0].startDate).toEqual(thisWeek);
    expect(weeks[0].veggies).toEqual(['apple', 'banana']);
    expect(weeks[0].challenge).toBe('tomato');
  });
});
