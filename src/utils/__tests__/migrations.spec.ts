import {describe, it, expect, vi} from 'vitest';
import {DateTime} from 'luxon';
import {DEFAULT_SETTINGS} from '@/utils/constants';
import {
  applyMigrations,
  readStorageData,
  writeStorageData,
  runMigrations,
  createBackup,
  restoreFromBackup,
} from '@/utils/migrations';
import {dateParser, dateReplacer} from '@/utils/helpers';
import type {Settings, Week} from '@/types';

const thisWeek = DateTime.now().startOf('week');
const lastWeek = thisWeek.minus({weeks: 1});

describe('applyMigrations', () => {
  it('returns unchanged data when fromVersion equals toVersion', () => {
    const data = {settings: {...DEFAULT_SETTINGS, migrationVersion: 2}};
    const result = applyMigrations(data, 1, 1);
    expect(result).toBe(data);
  });

  it('returns unchanged data when fromVersion is greater than toVersion', () => {
    const data = {settings: {...DEFAULT_SETTINGS, migrationVersion: 1}};
    const result = applyMigrations(data, 1, 0);
    expect(result).toBe(data);
  });

  it('returns unchanged data when no migrations are defined', () => {
    const data = {
      settings: {...DEFAULT_SETTINGS, migrationVersion: 0},
      weeks: [],
    };
    const result = applyMigrations(data, 0, 1);
    expect(result).toEqual(data);
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
  it('does not run when fromVersion equals toVersion', () => {
    const initialData = {...DEFAULT_SETTINGS, migrationVersion: 2};
    localStorage.setItem('veggies-settings', JSON.stringify(initialData, dateReplacer));

    const getItemSpy = vi.spyOn(localStorage, 'getItem');
    const setItemSpy = vi.spyOn(localStorage, 'setItem');

    runMigrations(2, 2);

    expect(getItemSpy).not.toHaveBeenCalled();
    expect(setItemSpy).not.toHaveBeenCalled();

    getItemSpy.mockRestore();
    setItemSpy.mockRestore();

    const stored = JSON.parse(localStorage.getItem('veggies-settings')!, dateParser);
    expect(stored).toEqual(initialData);
  });

  it('does not run when fromVersion is greater than toVersion', () => {
    const initialData = {...DEFAULT_SETTINGS, migrationVersion: 2};
    localStorage.setItem('veggies-settings', JSON.stringify(initialData, dateReplacer));

    const getItemSpy = vi.spyOn(localStorage, 'getItem');
    const setItemSpy = vi.spyOn(localStorage, 'setItem');

    runMigrations(2, 1);

    expect(getItemSpy).not.toHaveBeenCalled();
    expect(setItemSpy).not.toHaveBeenCalled();

    getItemSpy.mockRestore();
    setItemSpy.mockRestore();

    const stored = JSON.parse(localStorage.getItem('veggies-settings')!, dateParser);
    expect(stored).toEqual(initialData);
  });
});

describe('createBackup', () => {
  it('creates backup copies of all veggies-* keys', () => {
    const weeks: Week[] = [
      {startDate: lastWeek, veggies: ['apple', 'banana'], challenge: 'orange'},
      {startDate: thisWeek, veggies: ['tomato', 'carrot', 'spinach'], challenge: 'cucumber'},
    ];

    localStorage.setItem('veggies-settings', JSON.stringify({...DEFAULT_SETTINGS}, dateReplacer));
    localStorage.setItem('veggies-weeks', JSON.stringify(weeks, dateReplacer));
    localStorage.setItem('veggies-startDate', thisWeek.toISODate()!);
    localStorage.setItem('other-data', 'should not be backed up');

    createBackup();

    expect(localStorage.getItem('veggies-settings-backup')).toBe(
      JSON.stringify({...DEFAULT_SETTINGS}, dateReplacer),
    );
    expect(localStorage.getItem('veggies-weeks-backup')).toBe(JSON.stringify(weeks, dateReplacer));
    expect(localStorage.getItem('veggies-startDate-backup')).toBe(thisWeek.toISODate());
    expect(localStorage.getItem('other-data-backup')).toBeNull();

    // Verify DateTime objects are properly serialized in backup
    const backedUpWeeks = JSON.parse(
      localStorage.getItem('veggies-weeks-backup')!,
      dateParser,
    ) as Week[];
    expect(backedUpWeeks[0].startDate.equals(lastWeek)).toBe(true);
    expect(backedUpWeeks[0].veggies).toEqual(['apple', 'banana']);
    expect(backedUpWeeks[1].startDate.equals(thisWeek)).toBe(true);
    expect(backedUpWeeks[1].veggies).toEqual(['tomato', 'carrot', 'spinach']);
  });

  it('preserves raw string values in backups', () => {
    const rawValue = '{"custom":"data","number":42}';
    localStorage.setItem('veggies-custom', rawValue);

    createBackup();

    expect(localStorage.getItem('veggies-custom-backup')).toBe(rawValue);
  });

  it('does not backup existing backup keys', () => {
    localStorage.setItem('veggies-settings', 'original');
    localStorage.setItem('veggies-old-backup', 'old backup');

    createBackup();

    expect(localStorage.getItem('veggies-settings-backup')).toBe('original');
    expect(localStorage.getItem('veggies-old-backup')).toBe('old backup');
    expect(localStorage.getItem('veggies-old-backup-backup')).toBeNull();
  });

  it('handles empty localStorage', () => {
    expect(() => createBackup()).not.toThrow();
  });
});

describe('restoreFromBackup', () => {
  it('restores all backup keys with DateTime objects properly', () => {
    const weeks: Week[] = [
      {startDate: lastWeek, veggies: ['apple', 'banana'], challenge: 'orange'},
      {startDate: thisWeek, veggies: ['tomato', 'carrot', 'spinach'], challenge: 'cucumber'},
    ];

    localStorage.setItem(
      'veggies-settings-backup',
      JSON.stringify({...DEFAULT_SETTINGS}, dateReplacer),
    );
    localStorage.setItem('veggies-weeks-backup', JSON.stringify(weeks, dateReplacer));
    localStorage.setItem('veggies-startDate-backup', thisWeek.toISODate()!);

    restoreFromBackup();

    expect(localStorage.getItem('veggies-settings')).toBe(
      JSON.stringify({...DEFAULT_SETTINGS}, dateReplacer),
    );
    expect(localStorage.getItem('veggies-weeks')).toBe(JSON.stringify(weeks, dateReplacer));
    expect(localStorage.getItem('veggies-startDate')).toBe(thisWeek.toISODate());

    // Verify DateTime objects are properly restored and parsed
    const restoredWeeks = JSON.parse(localStorage.getItem('veggies-weeks')!, dateParser) as Week[];
    expect(restoredWeeks[0].startDate.equals(lastWeek)).toBe(true);
    expect(restoredWeeks[0].veggies).toEqual(['apple', 'banana']);
    expect(restoredWeeks[1].startDate.equals(thisWeek)).toBe(true);
    expect(restoredWeeks[1].veggies).toEqual(['tomato', 'carrot', 'spinach']);
  });

  it('removes backup keys after restoration', () => {
    localStorage.setItem('veggies-settings-backup', 'backup-data');

    restoreFromBackup();

    expect(localStorage.getItem('veggies-settings-backup')).toBeNull();
  });

  it('overwrites existing keys with backup values', () => {
    localStorage.setItem('veggies-settings', 'corrupted-data');
    localStorage.setItem('veggies-settings-backup', 'good-backup-data');

    restoreFromBackup();

    expect(localStorage.getItem('veggies-settings')).toBe('good-backup-data');
  });

  it('handles empty localStorage', () => {
    expect(() => restoreFromBackup()).not.toThrow();
  });

  it('only restores veggies-* backup keys', () => {
    localStorage.setItem('other-data-backup', 'should not restore');
    localStorage.setItem('veggies-settings-backup', 'should restore');

    restoreFromBackup();

    expect(localStorage.getItem('other-data')).toBeNull();
    expect(localStorage.getItem('veggies-settings')).toBe('should restore');
  });

  it('preserves exact string values during restore', () => {
    const weeks = '[{"startDate":"2024-01-05","veggies":[]}]';
    localStorage.setItem('veggies-weeks-backup', weeks);

    restoreFromBackup();

    expect(localStorage.getItem('veggies-weeks')).toBe(weeks);
  });
});
