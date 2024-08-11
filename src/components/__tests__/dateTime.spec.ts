import {describe, it, expect, beforeEach} from 'vitest';
import {shallowMount} from '@vue/test-utils';
import {useActivityStore} from '@/stores/activityStore';
import useDateTime from '@/hooks/dateTime';
import {DateTime} from 'luxon';

const withSetup = <T>(hook: () => T) =>
  new Promise<T>((resolve) => {
    shallowMount({
      template: '<div></div>',
      setup() {
        resolve(hook());
      },
    });
  });

describe('dateTime', () => {
  const thisWeek = DateTime.now().startOf('week');
  const lastWeek = thisWeek.minus({weeks: 1});
  let activityStore: ReturnType<typeof useActivityStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
  });

  it('returns the total amount of weeks', async () => {
    const dateTimeFn = await withSetup(useDateTime);
    activityStore.startDate = thisWeek;
    expect(dateTimeFn.getTotalWeeks.value).toBe(1);
    activityStore.startDate = lastWeek;
    expect(dateTimeFn.getTotalWeeks.value).toBe(2);
  });

  it('returns a date interval for selected week', async () => {
    const {getDateInterval} = await withSetup(useDateTime);
    activityStore.startDate = DateTime.local(2024, 4, 1).startOf('week');
    expect(getDateInterval.value(0)).toEqual('04/01/2024 - 04/07/2024');
    expect(getDateInterval.value(1)).toEqual('04/08/2024 - 04/14/2024');
    expect(getDateInterval.value(2)).toEqual('04/15/2024 - 04/21/2024');
  });

  it('returns all weekStarts from the start date', async () => {
    const {getWeekStarts} = await withSetup(useDateTime);
    activityStore.startDate = thisWeek;
    expect(getWeekStarts.value).toEqual([thisWeek]);
    activityStore.startDate = lastWeek;
    expect(getWeekStarts.value).toEqual([lastWeek, thisWeek]);
    activityStore.startDate = thisWeek.minus({weeks: 5});
    expect(getWeekStarts.value.length).toBe(6);
  });
});
