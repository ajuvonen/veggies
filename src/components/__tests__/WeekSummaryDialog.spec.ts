import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import {take} from 'remeda';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import type {WeekData} from '@/utils/types';
import DialogStub from './DialogStub.vue';
import WeekSummaryDialog from '@/components/WeekSummaryDialog.vue';
import {ALL_VEGGIES} from '@/utils/veggieDetails';

const currentWeek = DateTime.now().startOf('week');
const lastWeek = currentWeek.minus({weeks: 1});
const twoWeeksAgo = currentWeek.minus({weeks: 2});

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
    activityStore.startDate = currentWeek;
    const wrapper = mounter();
    expect(wrapper.find('#week-start-dialog').exists()).toBe(false);
  });

  it('shows dialog when not in first week and summaryViewedDate is null', async () => {
    activityStore.startDate = lastWeek;
    const wrapper = mounter();
    expect(wrapper.find('#week-start-dialog').exists()).toBe(true);
  });

  it('shows dialog when not in first week and summaryViewedDate is from previous week', async () => {
    activityStore.startDate = twoWeeksAgo;

    // Set summaryViewedDate to previous week
    appStateStore.settings.summaryViewedDate = twoWeeksAgo;

    const wrapper = mounter();
    expect(wrapper.find('#week-start-dialog').exists()).toBe(true);
  });

  it('does not show dialog when summaryViewedDate is current week', async () => {
    activityStore.startDate = lastWeek;

    // Set summaryViewedDate to current week
    appStateStore.settings.summaryViewedDate = currentWeek;

    const wrapper = mounter();
    expect(wrapper.find('#week-start-dialog').exists()).toBe(false);
  });

  it('calculates basic week data properties correctly', () => {
    // Clear and setup test data
    activityStore.weeks.splice(0);
    activityStore.weeks.push(
      {startDate: lastWeek, veggies: ['apple', 'spinach', 'tomato']},
      {startDate: currentWeek, veggies: ['carrot', 'broccoli']},
    );
    activityStore.startDate = lastWeek;

    const wrapper = mounter();
    const lastWeekData = wrapper.vm.lastWeekData as WeekData;

    expect(lastWeekData.veggies).toEqual(['apple', 'spinach', 'tomato']);
    expect(lastWeekData.atMostVeggies).toBe(3); // Max veggies from any week
    expect(lastWeekData.weekNumber).toBe(lastWeek.toFormat('W'));
  });

  it('identifies first week correctly for lastWeekData', () => {
    activityStore.weeks = [{startDate: lastWeek, veggies: ['apple']}];
    activityStore.startDate = lastWeek;

    const wrapper = mounter();
    const lastWeekData = wrapper.vm.lastWeekData as WeekData;

    expect(lastWeekData.firstWeek).toBe(true);
  });

  it('identifies non-first week correctly for lastWeekData', () => {
    activityStore.weeks = [
      {startDate: lastWeek, veggies: ['apple']},
      {startDate: currentWeek, veggies: ['spinach']},
    ];
    activityStore.startDate = lastWeek;

    const wrapper = mounter();
    const lastWeekData = wrapper.vm.lastWeekData as WeekData;

    expect(lastWeekData.firstWeek).toBe(false);
  });

  it('calculates mean correctly from past 5 weeks', () => {
    for (let i = 0; i < 7; i++) {
      const weekStart = currentWeek.minus({weeks: i});
      const veggieCount = (i + 1) * 2; // 2, 4, 6, 8, 10, 12 veggies
      const veggies = take(ALL_VEGGIES, veggieCount);
      activityStore.weeks.push({startDate: weekStart, veggies});
    }
    activityStore.startDate = currentWeek.minus({weeks: 6});

    const wrapper = mounter();
    const lastWeekData = wrapper.vm.lastWeekData as WeekData;

    // Should use only the last 5 weeks: 4, 6, 8, 10, 12 -> mean = 8
    expect(lastWeekData.mean).toBe(8);
  });

  it('calculates mean correctly from less than 5 weeks when no more weeks exist', () => {
    activityStore.weeks = [
      {startDate: twoWeeksAgo, veggies: ['apple', 'spinach']},
      {startDate: lastWeek, veggies: ['apple', 'spinach', 'tomato', 'carrot']},
    ];
    activityStore.startDate = twoWeeksAgo;

    const wrapper = mounter();
    const lastWeekData = wrapper.vm.lastWeekData as WeekData;

    expect(lastWeekData.mean).toBe(3);
  });

  it('finds weekly challenge correctly', () => {
    activityStore.weeks = [
      {startDate: lastWeek, veggies: ['apple', 'spinach']},
      {startDate: currentWeek, veggies: ['carrot']},
    ];
    activityStore.challenges = [
      {startDate: lastWeek, veggie: 'apple'},
      {startDate: currentWeek, veggie: 'carrot'},
    ];
    activityStore.startDate = lastWeek;

    const wrapper = mounter();
    const lastWeekData = wrapper.vm.lastWeekData as WeekData;

    expect(lastWeekData.challenge).toBe('apple');
  });

  it('handles missing weekly challenge', () => {
    activityStore.startDate = lastWeek;

    const wrapper = mounter();
    const lastWeekData = wrapper.vm.lastWeekData as WeekData;

    expect(lastWeekData.challenge).toBeUndefined();
  });

  it('calculates first-time veggies correctly when weeks >= 2', () => {
    activityStore.weeks = [
      {startDate: twoWeeksAgo, veggies: ['apple', 'carrot']},
      {startDate: lastWeek, veggies: ['apple', 'spinach', 'broccoli']},
    ];
    activityStore.startDate = twoWeeksAgo;

    const wrapper = mounter();
    const lastWeekData = wrapper.vm.lastWeekData as WeekData;

    expect(lastWeekData.firstTimeVeggies).toEqual(['spinach', 'broccoli']);
  });

  it('returns empty first-time veggies when weeks < 2', () => {
    activityStore.weeks = [{startDate: lastWeek, veggies: ['apple', 'spinach']}];
    activityStore.startDate = lastWeek;

    const wrapper = mounter();
    const lastWeekData = wrapper.vm.lastWeekData as WeekData;

    expect(lastWeekData.firstTimeVeggies).toEqual([]);
  });

  it('calculates previous week count correctly', () => {
    activityStore.weeks = [
      {startDate: twoWeeksAgo, veggies: ['apple', 'carrot', 'spinach']},
      {startDate: lastWeek, veggies: ['apple', 'spinach']},
    ];
    activityStore.startDate = twoWeeksAgo;

    const wrapper = mounter();
    const lastWeekData = wrapper.vm.lastWeekData as WeekData;

    expect(lastWeekData.previousWeekCount).toBe(3);
  });

  it('handles hot streak calculation', () => {
    // Clear and create weeks with 30+ veggies to trigger hot streak
    const thirtyVeggies = take(ALL_VEGGIES, 30);
    activityStore.weeks = [
      {startDate: twoWeeksAgo, veggies: thirtyVeggies},
      {startDate: lastWeek, veggies: thirtyVeggies},
    ];
    activityStore.startDate = twoWeeksAgo;

    const wrapper = mounter();
    const lastWeekData = wrapper.vm.lastWeekData as WeekData;

    expect(lastWeekData.hotStreak).toBe(2);
  });

  it('displays three summary messages and a promoted achievement', () => {
    // Setup test data to ensure we have summary content
    const thirtyVeggies = take(ALL_VEGGIES, 30);
    activityStore.weeks = [
      {startDate: twoWeeksAgo, veggies: ['apple', 'carrot', 'spinach']},
      {startDate: lastWeek, veggies: thirtyVeggies},
    ];
    activityStore.challenges = [{startDate: lastWeek, veggie: 'apple'}];
    activityStore.startDate = twoWeeksAgo;

    const wrapper = mounter();

    const badges = wrapper.findAll('.weekSummaryBadge');
    const summaryItems = wrapper.findAll('.weekSummaryDialog__message');

    expect(summaryItems.length).toBe(3);
    expect(badges.length).toBe(3);
    expect(wrapper.findByTestId('promoted-achievement').exists()).toBe(true);
  });
});
