import {
  dateParser,
  dateReplacer,
  getStorageKeys,
  getRandomItem,
  getImportSchema,
} from '@/utils/helpers';
import {ALL_VEGGIES} from '@/utils/veggieDetails';
import {DateTime} from 'luxon';
import {clone} from 'remeda';
import type {Week, Settings} from '@/types';

type StorageData = Record<string, unknown>;

type Migration = {
  version: number;
  name: string;
  migrate: (data: StorageData) => StorageData;
};

const migrations: Migration[] = [
  {
    version: 1,
    name: 'No-op migration',
    migrate: (data) => {
      return clone(data);
    },
  },
  {
    version: 2,
    name: 'Move challenges to weeks',
    migrate: (data) => {
      const weeks = (data.weeks || []) as Week[];
      const challenges = (data.challenges || []) as {
        startDate: DateTime;
        veggie: string;
      }[];
      const settings = data.settings as Settings;

      // Get all available veggies excluding allergens
      const availableVeggies = ALL_VEGGIES.filter((veggie) => !settings.allergens.includes(veggie));

      // Return data without challenges key
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {challenges: _, ...rest} = data;
      return {
        ...rest,
        weeks: weeks.map((week) => {
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
      const startDate = data['start-date'];
      if (startDate !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {'start-date': _, ...rest} = data;
        return {
          ...rest,
          startDate,
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
    const migratedData = migration.migrate(currentData);

    // Update migrationVersion after each migration
    const settings = migratedData.settings as Record<string, unknown>;
    return {
      ...migratedData,
      settings: {
        ...settings,
        migrationVersion: migration.version,
      },
    };
  }, data);
}

/**
 * Reads all veggies-prefixed data from localStorage.
 * Strips the veggies- prefix from keys and filters out dangerous keys.
 * @returns Storage data as a plain object with unprefixed keys
 */
export function readStorageData(): StorageData {
  const data: StorageData = {};
  const keys = getStorageKeys().filter((key) => !key.endsWith('-backup'));
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];

  keys.forEach((key) => {
    // Strip veggies- prefix
    const unprefixedKey = key.replace(/^veggies-/, '');

    // Filter out dangerous keys that could cause prototype pollution
    if (dangerousKeys.includes(unprefixedKey)) {
      return;
    }

    const value = localStorage.getItem(key);
    if (value !== null) {
      try {
        data[unprefixedKey] = JSON.parse(value, dateParser);
      } catch {
        // JSON.parse failed - handle plain strings and plain ISO date strings
        if (value && value.match(/^\d{4}-\d{2}-\d{2}(T.*)?$/)) {
          data[unprefixedKey] = DateTime.fromISO(value.split('T')[0]!);
        } else {
          data[unprefixedKey] = value;
        }
      }
    }
  });
  return data;
}

/**
 * Writes storage data to localStorage.
 * Adds veggies- prefix to all keys when writing.
 * Writes new data first, then removes stale keys.
 * @param data - The storage data to write (with unprefixed keys)
 * @param toVersion - Migration version to update in settings
 */
export function writeStorageData(data: StorageData, toVersion: number): void {
  const settings = data.settings as Record<string, unknown>;
  const dataToWrite = {
    ...data,
    settings: {
      ...settings,
      migrationVersion: toVersion,
    },
  };

  const writtenKeys = new Set<string>();

  for (const [key, value] of Object.entries(dataToWrite)) {
    const prefixedKey = `veggies-${key}`;

    let serialized: string;
    if (typeof value === 'string') {
      serialized = value;
    } else if (DateTime.isDateTime(value)) {
      serialized = value.toISODate()!;
    } else {
      serialized = JSON.stringify(value, dateReplacer);
    }

    localStorage.setItem(prefixedKey, serialized);
    writtenKeys.add(prefixedKey);
  }

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
 * Validates migrated data against schema before writing.
 * @param fromVersion - The current migration version
 * @param toVersion - The target migration version
 */
export async function runMigrations(fromVersion: number, toVersion: number): Promise<void> {
  if (fromVersion >= toVersion) return;

  createBackup();

  try {
    const currentData = readStorageData();
    const migratedData = applyMigrations(currentData, fromVersion, toVersion);

    // Validate migrated data against schema
    const schema = await getImportSchema();
    const validatedData = schema.parse(migratedData);

    writeStorageData(validatedData, toVersion);
  } catch (error) {
    restoreFromBackup();
    throw error;
  }
}
