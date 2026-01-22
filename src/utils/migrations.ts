import {dateParser, dateReplacer, getStorageKeys} from '@/utils/helpers';

type StorageData = Record<string, unknown>;

type Migration = {
  version: number;
  name: string;
  migrate: (data: StorageData) => StorageData;
};

const migrations: Migration[] = [
  // Example migration for version 2:
  // {
  //   version: 2,
  //   name: 'add-favorite-veggies',
  //   migrate: (data) => {
  //     const settings = data['veggies-settings'] as any;
  //     return {
  //       ...data,
  //       'veggies-settings': {
  //         ...settings,
  //         favoriteVeggies: [] as string[],
  //       },
  //     };
  //   },
  // },
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
