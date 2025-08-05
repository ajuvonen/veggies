import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import DialogStub from './DialogStub.vue';
import WeekSummaryDialog from '@/components/WeekSummaryDialog.vue';

const mounter = () =>
  mount(WeekSummaryDialog, {
    global: {
      stubs: {
        Dialog: DialogStub,
        DialogPanel: {
          template: '<div><slot /></div>',
        },
        DialogTitle: true,
      },
    },
  });

describe('WeekSummaryDialog', () => {
  let activityStore: ReturnType<typeof useActivityStore>;
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
    appStateStore = useAppStateStore();
  });

  it('does not show dialog when no startDate is set', async () => {
    const wrapper = mounter();
    expect(wrapper.find('#week-start-dialog').exists()).toBe(false);
  });

  it('does not show dialog when in the first week (startDate equals currentWeekStart)', async () => {
    activityStore.startDate = DateTime.now().startOf('week');
    const wrapper = mounter();
    expect(wrapper.find('#week-start-dialog').exists()).toBe(false);
  });

  it('shows dialog when not in first week and summaryViewedDate is null', async () => {
    activityStore.startDate = DateTime.now().startOf('week').minus({weeks: 1});
    const wrapper = mounter();
    expect(wrapper.find('#week-start-dialog').exists()).toBe(true);
  });

  it('shows dialog when not in first week and summaryViewedDate is from previous week', async () => {
    const firstWeek = DateTime.now().startOf('week').minus({weeks: 2});
    activityStore.startDate = firstWeek;

    // Set summaryViewedDate to previous week
    appStateStore.settings.summaryViewedDate = firstWeek;

    const wrapper = mounter();
    expect(wrapper.find('#week-start-dialog').exists()).toBe(true);
  });

  it('does not show dialog when summaryViewedDate is current week', async () => {
    const currentWeek = DateTime.now().startOf('week');
    const firstWeek = currentWeek.minus({weeks: 1});

    activityStore.startDate = firstWeek;

    // Set summaryViewedDate to current week
    appStateStore.settings.summaryViewedDate = currentWeek;

    const wrapper = mounter();
    expect(wrapper.find('#week-start-dialog').exists()).toBe(false);
  });
});
