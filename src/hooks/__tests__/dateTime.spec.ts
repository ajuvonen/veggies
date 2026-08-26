import {describe, it, expect, beforeEach} from 'vitest';
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
    const mondayWeekStart = Temporal.PlainDate.from('2025-09-15');
    const result = formatWeekString(mondayWeekStart);

    expect(result).toBe('Week 38/2025 (15/09-21/09)');
  });

  it('formats week string for fi locale', () => {
    appStateStore.settings.locale = 'fi';
    const {formatWeekString} = withSetup(useDateTime);
    const mondayWeekStart = Temporal.PlainDate.from('2025-09-15');
    const result = formatWeekString(mondayWeekStart);

    expect(result).toBe('Week 38/2025 (15.9.-21.9.)');
  });

  it('formats week number', () => {
    const {formatWeekNumber} = withSetup(useDateTime);
    const mondayWeekStart = Temporal.PlainDate.from('2025-09-15');
    const result = formatWeekNumber(mondayWeekStart);

    expect(result).toBe('38/2025');
  });

  it('formats date for en locale without year', () => {
    appStateStore.settings.locale = 'en';
    const {formatDate} = withSetup(useDateTime);
    const date = Temporal.PlainDate.from('2026-08-04');
    const result = formatDate(date);

    expect(result).toBe('04/08');
  });

  it('formats date for en locale with year', () => {
    appStateStore.settings.locale = 'en';
    const {formatDate} = withSetup(useDateTime);
    const date = Temporal.PlainDate.from('2026-08-04');
    const result = formatDate(date, true);

    expect(result).toBe('04/08/2026');
  });

  it('formats date for fi locale without year', () => {
    appStateStore.settings.locale = 'fi';
    const {formatDate} = withSetup(useDateTime);
    const date = Temporal.PlainDate.from('2026-08-04');
    const result = formatDate(date);

    expect(result).toBe('4.8.');
  });

  it('formats date for fi locale with year', () => {
    appStateStore.settings.locale = 'fi';
    const {formatDate} = withSetup(useDateTime);
    const date = Temporal.PlainDate.from('2026-08-04');
    const result = formatDate(date, true);

    expect(result).toBe('4.8.2026');
  });
});
