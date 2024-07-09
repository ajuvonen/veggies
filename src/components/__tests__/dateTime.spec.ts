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
  let activityStore: ReturnType<typeof useActivityStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
  });

  it('returns the total amount of weeks', async () => {
    const dateTimeFn = await withSetup(useDateTime);
    activityStore.settings.startDate = DateTime.now().startOf('week');
    expect(dateTimeFn.getTotalWeeks.value).toBe(1);
    activityStore.settings.startDate = DateTime.now().startOf('week').minus({weeks: 1});
    expect(dateTimeFn.getTotalWeeks.value).toBe(2);
  });

  it('returns a date interval for selected week', async () => {
    const {getDateInterval} = await withSetup(useDateTime);
    activityStore.settings.startDate = DateTime.local(2024, 4, 1).startOf('week');
    expect(getDateInterval.value(0)).toEqual('04/01/2024 - 04/07/2024');
    expect(getDateInterval.value(1)).toEqual('04/08/2024 - 04/14/2024');
    expect(getDateInterval.value(2)).toEqual('04/15/2024 - 04/21/2024');
  });
});
