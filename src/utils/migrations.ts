import {dateParser, dateReplacer, getStorageKeys, getRandomItem} from '@/utils/helpers';
import {ALL_VEGGIES} from '@/utils/veggieDetails';
import type {DateTime} from 'luxon';
import type {Week, Settings} from '@/types';

type StorageData = Record<string, unknown>;

type Migration = {
  version: number;
  name: string;
  migrate: (data: StorageData) => StorageData;
};

const migrations: Migration[] = [
  {
    version: 2,
    name: 'Move challenges to weeks',
    migrate: (data) => {
      const weeks = (data['veggies-weeks'] || []) as Week[];
      const challenges = (data['veggies-challenges'] || []) as {
        startDate: DateTime;
        veggie: string;
      }[];
      const settings = data['veggies-settings'] as Settings;

      // Get all available veggies excluding allergens
      const availableVeggies = ALL_VEGGIES.filter((veggie) => !settings.allergens.includes(veggie));

      // Return data without challenges key
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {['veggies-challenges']: _, ...rest} = data;
      return {
        ...rest,
        'veggies-weeks': weeks.map((week) => {
          // If week already has a challenge, keep it
          if (week.challenge) {
            return week;
          }

          // Find matching challenge by date
          const matchingChallenge = challenges.find(({startDate}) =>
            startDate.equals(week.startDate),
          );

          return {
            ...week,
            challenge: matchingChallenge?.veggie ?? getRandomItem(availableVeggies)!,
          };
        }),
      };
    },
  },
  {
    version: 3,
    name: 'Rename start-date key',
    migrate: (data) => {
      const startDate = data['veggies-start-date'];
      if (startDate !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {['veggies-start-date']: _, ...rest} = data;
        return {
          ...rest,
          'veggies-startDate': startDate,
        };
      }
      return data;
    },
  },
];

/**
 * Applies migrations sequentially to storage data.
 * @param data - The storage data to migrate
 * @param fromVersion - The current migration version
 * @param toVersion - The target migration version
 * @returns The migrated storage data
 */
export function applyMigrations(
  data: StorageData,
  fromVersion: number,
  toVersion: number,
): StorageData {
  if (fromVersion >= toVersion) return data;

  const toRun = migrations
    .filter((m) => m.version > fromVersion && m.version <= toVersion)
    .sort((a, b) => a.version - b.version);

  return toRun.reduce((currentData, migration) => {
    console.log(`Applying migration ${migration.version}: ${migration.name}`);
    return migration.migrate(currentData);
  }, data);
}

/**
 * Reads all veggies-prefixed data from localStorage.
 * @returns Storage data as a plain object
 */
export function readStorageData(): StorageData {
  const data: StorageData = {};
  const keys = getStorageKeys();

  keys.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        data[key] = JSON.parse(value, dateParser);
      } catch {
        data[key] = value;
      }
    }
  });
  return data;
}

/**
 * Writes storage data to localStorage.
 * Writes new data first, then removes stale keys.
 * @param data - The storage data to write
 * @param toVersion - Migration version to update in settings
 */
export function writeStorageData(data: StorageData, toVersion: number): void {
  const settings = data['veggies-settings'] as Record<string, unknown>;
  const dataToWrite = {
    ...data,
    'veggies-settings': {
      ...settings,
      migrationVersion: toVersion,
    },
  };

  for (const [key, value] of Object.entries(dataToWrite)) {
    if (key.startsWith('veggies-')) {
      localStorage.setItem(
        key,
        typeof value === 'string' ? value : JSON.stringify(value, dateReplacer),
      );
    }
  }

  const writtenKeys = new Set(Object.keys(dataToWrite).filter((key) => key.startsWith('veggies-')));
  const allKeys = getStorageKeys();
  const keysToRemove = allKeys.filter((key) => !writtenKeys.has(key));

  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

/**
 * Creates backup copies of all veggies-* keys in localStorage.
 */
export function createBackup(): void {
  const keys = getStorageKeys().filter((key) => !key.endsWith('-backup'));

  keys.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      localStorage.setItem(`${key}-backup`, value);
    }
  });
}

/**
 * Restores all veggies-* keys from their backup copies.
 * Removes backup keys after restoration.
 */
export function restoreFromBackup(): void {
  const backupKeys = getStorageKeys().filter((key) => key.endsWith('-backup'));

  backupKeys.forEach((backupKey) => {
    const originalKey = backupKey.replace(/-backup$/, '');
    const value = localStorage.getItem(backupKey);
    if (value !== null) {
      localStorage.setItem(originalKey, value);
      localStorage.removeItem(backupKey);
    }
  });
}

/**
 * Reads current data, applies migrations, and writes back to localStorage.
 * Creates backups before migration and restores on error.
 * @param fromVersion - The current migration version
 * @param toVersion - The target migration version
 */
export function runMigrations(fromVersion: number, toVersion: number): void {
  if (fromVersion >= toVersion) return;

  createBackup();

  try {
    const currentData = readStorageData();
    const migratedData = applyMigrations(currentData, fromVersion, toVersion);
    writeStorageData(migratedData, toVersion);
  } catch (error) {
    restoreFromBackup();
    throw error;
  }
}
