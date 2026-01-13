import {describe, it, expect, beforeEach} from 'vitest';
import {DateTime} from 'luxon';
import {useDateTime} from '@/hooks/dateTime';
import {useAppStateStore} from '@/stores/appStateStore';
import {withSetup} from '@/test-utils';

describe('dateTime', () => {
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    appStateStore = useAppStateStore();
  });

  it('formats week string for en locale', () => {
    appStateStore.settings.locale = 'en';
    const {formatWeekString} = withSetup(useDateTime);
    const mondayWeekStart = DateTime.fromISO('2025-09-15');
    const result = formatWeekString(mondayWeekStart);

    expect(result).toBe('Week 38/2025 (15/09-21/09)');
  });

  it('formats week string for fi locale', () => {
    appStateStore.settings.locale = 'fi';
    const {formatWeekString} = withSetup(useDateTime);
    const mondayWeekStart = DateTime.fromISO('2025-09-15');
    const result = formatWeekString(mondayWeekStart);

    expect(result).toBe('Week 38/2025 (15.9.-21.9.)');
  });

  it('formats week number', () => {
    const {formatWeekNumber} = withSetup(useDateTime);
    const mondayWeekStart = DateTime.fromISO('2025-09-15');
    const result = formatWeekNumber(mondayWeekStart);

    expect(result).toBe('38/2025');
  });
});
