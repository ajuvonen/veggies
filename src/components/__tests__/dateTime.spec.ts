import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import {useDateTime} from '@/hooks/dateTime';
import {useAppStateStore} from '@/stores/appStateStore';

const withSetup = () =>
  new Promise<ReturnType<typeof useDateTime>>((resolve) => {
    mount({
      shallow: true,
      template: '<div />',
      setup() {
        const result = useDateTime();
        resolve(result);
      },
    });
  });

describe('dateTime', () => {
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    appStateStore = useAppStateStore();
  });

  it('formats week string for en locale', async () => {
    appStateStore.settings.locale = 'en';
    const {formatWeekString} = await withSetup();
    const mondayWeekStart = DateTime.fromISO('2025-09-15');
    const result = formatWeekString(mondayWeekStart);

    expect(result).toBe('Week 38/2025 (15/09-21/09)');
  });

  it('formats week string for fi locale', async () => {
    appStateStore.settings.locale = 'fi';
    const {formatWeekString} = await withSetup();
    const mondayWeekStart = DateTime.fromISO('2025-09-15');
    const result = formatWeekString(mondayWeekStart);

    expect(result).toBe('Week 38/2025 (15.9.-21.9.)');
  });

  it('formats week number', async () => {
    const {formatWeekNumber} = await withSetup();
    const mondayWeekStart = DateTime.fromISO('2025-09-15');
    const result = formatWeekNumber(mondayWeekStart);

    expect(result).toBe('38/2025');
  });
});
