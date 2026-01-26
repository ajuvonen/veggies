import {describe, it, expect, vi} from 'vitest';
import {DateTime} from 'luxon';
import {
  CURRENT_MIGRATION_VERSION,
  DEFAULT_SETTINGS,
  MINIMUM_MIGRATION_VERSION,
} from '@/utils/constants';
import {
  applyMigrations,
  readStorageData,
  writeStorageData,
  runMigrations,
} from '@/utils/migrations';
import {dateParser, dateReplacer} from '@/utils/helpers';
import type {Settings, Week} from '@/types';

const thisWeek = DateTime.now().startOf('week');
const lastWeek = thisWeek.minus({weeks: 1});

const dataV1 = {
  settings: {
    allergens: ['peanut'],
    locale: 'en',
    showChartAnimations: true,
    suggestionCount: 10,
    summaryViewedDate: thisWeek,
  },
  weeks: [
    {startDate: lastWeek.toISODate(), veggies: ['apple', 'carrot', 'spinach', 'banana']},
    {
      startDate: thisWeek.toISODate(),
      veggies: ['arugula', 'black bean', 'chanterelle', 'iceberg lettuce'],
    },
  ],
  challenges: [
    {startDate: lastWeek.toISODate(), veggie: 'apple'},
    {startDate: thisWeek.toISODate(), veggie: 'lychee'},
  ],
  ['start-date']: lastWeek.toISODate(),
};

describe('applyMigrations', () => {
  it('returns unchanged data when fromVersion equals toVersion', () => {
    const data = dataV1;
    const result = applyMigrations(data, 1, 1);
    expect(result).toBe(data);
  });

  it('returns unchanged data when fromVersion is greater than toVersion', () => {
    const data = dataV1;
    const result = applyMigrations(data, 1, 0);
    expect(result).toBe(data);
  });
});

describe('readStorageData', () => {
  it('reads all veggies-prefixed keys from localStorage', () => {
    localStorage.setItem('veggies-startDate', thisWeek.toISODate());
    localStorage.setItem('veggies-settings', JSON.stringify({...DEFAULT_SETTINGS}, dateReplacer));
    localStorage.setItem('veggies-weeks', JSON.stringify([], dateReplacer));
    localStorage.setItem('other-data', 'should be ignored');

    const result = readStorageData();

    expect(result).toHaveProperty('startDate');
    expect(result).toHaveProperty('settings');
    expect(result).toHaveProperty('weeks');
    expect(result).not.toHaveProperty('other-data');
  });

  it('parses JSON data correctly', () => {
    const settings = {...DEFAULT_SETTINGS, locale: 'fi' as const, allergens: ['peanuts']};
    localStorage.setItem('veggies-settings', JSON.stringify(settings, dateReplacer));

    const result = readStorageData();

    expect(result.settings).toEqual(settings);
  });

  it('parses DateTime objects using dateParser', () => {
    const dateString = thisWeek.toISODate();
    const settings = {...DEFAULT_SETTINGS, summaryViewedDate: dateString};
    localStorage.setItem('veggies-settings', JSON.stringify(settings, dateReplacer));

    const result = readStorageData();
    const parsed = result.settings as Settings;

    expect(parsed.summaryViewedDate).toBeInstanceOf(DateTime);
    expect(parsed.summaryViewedDate?.toISODate()).toBe(dateString);
  });

  it('handles non-JSON string values gracefully', () => {
    localStorage.setItem('veggies-raw', 'plain string');

    const result = readStorageData();

    expect(result.raw).toBe('plain string');
  });

  it('returns empty object when no veggies data exists', () => {
    localStorage.setItem('other-key', 'value');

    const result = readStorageData();

    expect(result).toEqual({});
  });

  it('filters out dangerous keys that could cause prototype pollution', () => {
    localStorage.setItem('veggies-__proto__', 'dangerous');
    localStorage.setItem('veggies-constructor', 'dangerous');
    localStorage.setItem('veggies-prototype', 'dangerous');
    localStorage.setItem('veggies-settings', JSON.stringify({...DEFAULT_SETTINGS}, dateReplacer));

    const result = readStorageData();

    expect(result).not.toHaveProperty('__proto__');
    expect(result).not.toHaveProperty('constructor');
    expect(result).not.toHaveProperty('prototype');
    expect(result).toHaveProperty('settings');
  });

  it('reads top-level DateTime values correctly (startDate)', () => {
    const isoDate = thisWeek.toISODate();
    localStorage.setItem('veggies-startDate', isoDate);

    const result = readStorageData();

    expect(result.startDate).toBeInstanceOf(DateTime);
    expect((result.startDate as DateTime).toISODate()).toBe(isoDate);
  });
});

describe('writeStorageData', () => {
  it('writes veggies-prefixed data to localStorage', () => {
    const data = {
      settings: {...DEFAULT_SETTINGS},
      weeks: [],
    };

    writeStorageData(data, 1);

    const stored = JSON.parse(localStorage.getItem('veggies-settings')!, dateParser);
    expect(stored).toMatchObject({...DEFAULT_SETTINGS, migrationVersion: 1});
    expect(localStorage.getItem('veggies-weeks')).toBe(JSON.stringify([], dateReplacer));
  });

  it('serializes DateTime objects using dateReplacer', () => {
    const data = {
      settings: {...DEFAULT_SETTINGS, summaryViewedDate: thisWeek},
    };

    writeStorageData(data, 1);

    const stored = localStorage.getItem('veggies-settings');
    expect(stored).toContain(thisWeek.toISODate());
    expect(stored).not.toContain('T'); // Should only store date, not time
  });

  it('handles string values directly', () => {
    const data = {
      raw: 'plain string',
      settings: {...DEFAULT_SETTINGS},
    };

    writeStorageData(data, 1);

    expect(localStorage.getItem('veggies-raw')).toBe('plain string');
  });

  it('overwrites existing values', () => {
    localStorage.setItem(
      'veggies-settings',
      JSON.stringify({...DEFAULT_SETTINGS, locale: 'el'}, dateReplacer),
    );

    writeStorageData({settings: {...DEFAULT_SETTINGS}}, 2);

    const stored = JSON.parse(localStorage.getItem('veggies-settings')!, dateParser);
    expect(stored).toMatchObject({...DEFAULT_SETTINGS, migrationVersion: 2});
  });

  it('removes keys that are omitted from data object', () => {
    // Set up initial state with multiple keys
    localStorage.setItem('veggies-settings', JSON.stringify({...DEFAULT_SETTINGS}, dateReplacer));
    localStorage.setItem('veggies-challenges', JSON.stringify([], dateReplacer));
    localStorage.setItem('veggies-weeks', JSON.stringify([], dateReplacer));

    // Write data with only settings (omitting challenges and weeks)
    writeStorageData(
      {
        settings: {...DEFAULT_SETTINGS, locale: 'fi' as const},
      },
      1,
    );

    // Settings should be updated with migration version
    const stored = JSON.parse(localStorage.getItem('veggies-settings')!, dateParser);
    expect(stored).toMatchObject({...DEFAULT_SETTINGS, locale: 'fi', migrationVersion: 1});

    // Omitted keys should be removed
    expect(localStorage.getItem('veggies-challenges')).toBeNull();
    expect(localStorage.getItem('veggies-weeks')).toBeNull();
  });

  it('updates migrationVersion', () => {
    const data = {
      settings: {...DEFAULT_SETTINGS, migrationVersion: 1},
    };

    writeStorageData(data, 3);

    const stored = localStorage.getItem('veggies-settings');
    const parsed = JSON.parse(stored!, dateParser);
    expect(parsed.migrationVersion).toBe(3);
  });

  it('preserves other settings fields when updating migrationVersion', () => {
    const data = {
      settings: {...DEFAULT_SETTINGS, locale: 'fi' as const, allergens: ['peanuts']},
    };

    writeStorageData(data, 2);

    const stored = localStorage.getItem('veggies-settings');
    const parsed = JSON.parse(stored!, dateParser);
    expect(parsed.migrationVersion).toBe(2);
    expect(parsed.locale).toBe('fi');
    expect(parsed.allergens).toEqual(['peanuts']);
  });

  it('writes top-level DateTime values as plain ISO date strings', () => {
    const data = {
      settings: {...DEFAULT_SETTINGS},
      startDate: thisWeek,
    };

    writeStorageData(data, 1);

    const stored = localStorage.getItem('veggies-startDate');
    expect(stored).toBe(thisWeek.toISODate());
    expect(stored).not.toContain('"'); // Should not be JSON-stringified
  });

  it('round-trips top-level DateTime values correctly', () => {
    const data = {
      settings: {...DEFAULT_SETTINGS},
      startDate: thisWeek,
      weeks: [],
    };

    writeStorageData(data, 1);
    const result = readStorageData();

    expect(result.startDate).toBeInstanceOf(DateTime);
    expect((result.startDate as DateTime).equals(thisWeek)).toBe(true);
  });
});

describe('runMigrations', () => {
  it('does not run when fromVersion equals toVersion', async () => {
    const initialData = {
      ...dataV1.settings,
    };
    localStorage.setItem('veggies-settings', JSON.stringify(initialData, dateReplacer));

    const getItemSpy = vi.spyOn(localStorage, 'getItem');
    const setItemSpy = vi.spyOn(localStorage, 'setItem');

    await runMigrations(2, 2);

    expect(getItemSpy).not.toHaveBeenCalled();
    expect(setItemSpy).not.toHaveBeenCalled();

    getItemSpy.mockRestore();
    setItemSpy.mockRestore();

    const stored = JSON.parse(localStorage.getItem('veggies-settings')!, dateParser);
    expect(stored).toEqual(initialData);
  });

  it('does not run when fromVersion is greater than toVersion', async () => {
    const initialData = {
      ...dataV1.settings,
    };
    localStorage.setItem('veggies-settings', JSON.stringify(initialData, dateReplacer));

    const getItemSpy = vi.spyOn(localStorage, 'getItem');
    const setItemSpy = vi.spyOn(localStorage, 'setItem');

    await runMigrations(2, 1);

    expect(getItemSpy).not.toHaveBeenCalled();
    expect(setItemSpy).not.toHaveBeenCalled();

    getItemSpy.mockRestore();
    setItemSpy.mockRestore();

    const stored = JSON.parse(localStorage.getItem('veggies-settings')!, dateParser);
    expect(stored).toEqual(initialData);
  });

  it('throws validation error when migrationVersion is incorrect', async () => {
    // Set up data with version 0 (no migration run yet)
    const oldData = {...DEFAULT_SETTINGS, migrationVersion: 0};
    const weeks: Week[] = [
      {startDate: thisWeek, veggies: ['apple', 'banana'], challenge: 'orange'},
    ];

    localStorage.setItem('veggies-settings', JSON.stringify(oldData, dateReplacer));
    localStorage.setItem('veggies-weeks', JSON.stringify(weeks, dateReplacer));
    localStorage.setItem('veggies-startDate', thisWeek.toISODate()!);

    // Attempt to run migration from 0 to 1 (no-op migration)
    await expect(runMigrations(0, 1)).rejects.toThrow();
  });

  it('runs complete migration pipeline from v1 to current version', async () => {
    // Set up v1 data structure in localStorage
    // v1 had: separate start-date key, challenges array, no migrationVersion in settings
    localStorage.setItem('veggies-start-date', dataV1['start-date']!);
    localStorage.setItem('veggies-settings', JSON.stringify(dataV1.settings, dateReplacer));
    localStorage.setItem('veggies-weeks', JSON.stringify(dataV1.weeks, dateReplacer));
    localStorage.setItem('veggies-challenges', JSON.stringify(dataV1.challenges, dateReplacer));

    // Run migrations
    await runMigrations(MINIMUM_MIGRATION_VERSION, CURRENT_MIGRATION_VERSION);

    // Verify v1 localStorage keys are removed
    expect(localStorage.getItem('veggies-start-date')).toBeNull();
    expect(localStorage.getItem('veggies-startDate')).toBeNull();
    expect(localStorage.getItem('veggies-challenges')).toBeNull();

    // Read migrated data from localStorage
    const storedSettings = JSON.parse(localStorage.getItem('veggies-settings')!, dateParser);
    const storedWeeks = JSON.parse(localStorage.getItem('veggies-weeks')!, dateParser);

    // Verify current version structure in settings
    expect(storedSettings.startDate.equals(lastWeek)).toBe(true);
    expect(storedSettings.migrationVersion).toBe(CURRENT_MIGRATION_VERSION);
    expect(storedSettings.allergens).toEqual(['peanut']);
    expect(storedSettings.locale).toBe('en');
    expect(storedSettings.showChartAnimations).toBe(true);
    expect(storedSettings.suggestionCount).toBe(10);

    // Verify challenges were moved into weeks (migration v2)
    expect(storedWeeks).toHaveLength(2);
    expect(storedWeeks[0].challenge).toBe('apple');
    expect(storedWeeks[0].veggies).toEqual(['apple', 'carrot', 'spinach', 'banana']);
    expect(storedWeeks[0].startDate).toEqual(lastWeek);
    expect(storedWeeks[1].challenge).toBe('lychee');
    expect(storedWeeks[1].veggies).toEqual([
      'arugula',
      'black bean',
      'chanterelle',
      'iceberg lettuce',
    ]);
    expect(storedWeeks[1].startDate).toEqual(thisWeek);
  });
});
