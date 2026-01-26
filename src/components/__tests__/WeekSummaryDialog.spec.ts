import {describe, it, expect, beforeEach, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import {take} from 'remeda';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import type {WeekData} from '@/types';
import DialogStub from '@/test-utils/DialogStub.vue';
import WeekSummaryDialog from '@/components/WeekSummaryDialog.vue';
import {ALL_VEGGIES} from '@/utils/veggieDetails';

const thisWeek = DateTime.now().startOf('week');
const lastWeek = thisWeek.minus({weeks: 1});
const twoWeeksAgo = thisWeek.minus({weeks: 2});

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
    expect(wrapper.findByTestId('week-summary-dialog').exists()).toBe(false);
  });

  it('does not show dialog when in the first week (startDate equals thisWeekStart)', async () => {
    appStateStore.settings.startDate = thisWeek;
    const wrapper = mounter();
    expect(wrapper.findByTestId('week-summary-dialog').exists()).toBe(false);
  });

  it('shows dialog when not in first week and summaryViewedDate is null', async () => {
    appStateStore.settings.startDate = lastWeek;
    const wrapper = mounter();
    expect(wrapper.findByTestId('week-summary-dialog').exists()).toBe(true);
  });

  it('shows dialog when not in first week and summaryViewedDate is from previous week', async () => {
    appStateStore.settings.startDate = twoWeeksAgo;

    // Set summaryViewedDate to previous week
    appStateStore.settings.summaryViewedDate = twoWeeksAgo;

    const wrapper = mounter();
    expect(wrapper.findByTestId('week-summary-dialog').exists()).toBe(true);
  });

  it('does not show dialog when summaryViewedDate is current week', async () => {
    appStateStore.settings.startDate = lastWeek;

    // Set summaryViewedDate to current week
    appStateStore.settings.summaryViewedDate = thisWeek;

    const wrapper = mounter();
    expect(wrapper.findByTestId('week-summary-dialog').exists()).toBe(false);
  });

  it('calculates basic week data properties correctly', () => {
    // Clear and setup test data
    activityStore.weeks.splice(0);
    activityStore.weeks.push(
      {startDate: lastWeek, veggies: ['apple', 'spinach', 'tomato'], challenge: 'cucumber'},
      {startDate: thisWeek, veggies: ['carrot', 'broccoli'], challenge: 'cucumber'},
    );
    appStateStore.settings.startDate = lastWeek;

    const wrapper = mounter();
    const lastWeekData = wrapper.vm.lastWeekData as WeekData;

    expect(lastWeekData.veggies).toEqual(['apple', 'spinach', 'tomato']);
    expect(lastWeekData.atMostVeggies).toBe(3); // Max veggies from any week
    expect(lastWeekData.weekNumber).toBe(lastWeek.toFormat('W'));
  });

  it('identifies first week correctly for lastWeekData', () => {
    activityStore.weeks = [{startDate: lastWeek, veggies: ['apple'], challenge: 'cucumber'}];
    appStateStore.settings.startDate = lastWeek;

    const wrapper = mounter();
    const lastWeekData = wrapper.vm.lastWeekData as WeekData;

    expect(lastWeekData.firstWeek).toBe(true);
  });

  it('identifies non-first week correctly for lastWeekData', () => {
    activityStore.weeks = [
      {startDate: lastWeek, veggies: ['apple'], challenge: 'cucumber'},
      {startDate: thisWeek, veggies: ['spinach'], challenge: 'cucumber'},
    ];
    appStateStore.settings.startDate = lastWeek;

    const wrapper = mounter();
    const lastWeekData = wrapper.vm.lastWeekData as WeekData;

    expect(lastWeekData.firstWeek).toBe(false);
  });

  it('calculates mean correctly from past 5 weeks', () => {
    for (let i = 0; i < 7; i++) {
      const weekStart = thisWeek.minus({weeks: i});
      const veggieCount = (i + 1) * 2; // 2, 4, 6, 8, 10, 12 veggies
      const veggies = take(ALL_VEGGIES, veggieCount);
      activityStore.weeks.push({startDate: weekStart, veggies, challenge: 'cucumber'});
    }
    appStateStore.settings.startDate = thisWeek.minus({weeks: 6});

    const wrapper = mounter();
    const lastWeekData = wrapper.vm.lastWeekData as WeekData;

    // Should use only the last 5 weeks: 4, 6, 8, 10, 12 -> mean = 8
    expect(lastWeekData.mean).toBe(8);
  });

  it('calculates mean correctly from less than 5 weeks when no more weeks exist', () => {
    activityStore.weeks = [
      {startDate: twoWeeksAgo, veggies: ['apple', 'spinach'], challenge: 'cucumber'},
      {
        startDate: lastWeek,
        veggies: ['apple', 'spinach', 'tomato', 'carrot'],
        challenge: 'cucumber',
      },
    ];
    appStateStore.settings.startDate = twoWeeksAgo;

    const wrapper = mounter();
    const lastWeekData = wrapper.vm.lastWeekData as WeekData;

    expect(lastWeekData.mean).toBe(3);
  });

  it('finds weekly challenge correctly', () => {
    activityStore.weeks = [
      {startDate: lastWeek, veggies: ['apple', 'spinach'], challenge: 'apple'},
      {startDate: thisWeek, veggies: ['carrot'], challenge: 'carrot'},
    ];
    appStateStore.settings.startDate = lastWeek;

    const wrapper = mounter();
    const lastWeekData = wrapper.vm.lastWeekData as WeekData;

    expect(lastWeekData.challenge).toBe('apple');
  });

  it('handles missing weekly challenge', () => {
    appStateStore.settings.startDate = lastWeek;

    const wrapper = mounter();
    const lastWeekData = wrapper.vm.lastWeekData as WeekData;

    expect(lastWeekData.challenge).toBeUndefined();
  });

  it('calculates first-time veggies correctly when weeks >= 2', () => {
    activityStore.weeks = [
      {startDate: twoWeeksAgo, veggies: ['apple', 'carrot'], challenge: 'cucumber'},
      {startDate: lastWeek, veggies: ['apple', 'spinach', 'broccoli'], challenge: 'cucumber'},
    ];
    appStateStore.settings.startDate = twoWeeksAgo;

    const wrapper = mounter();
    const lastWeekData = wrapper.vm.lastWeekData as WeekData;

    expect(lastWeekData.firstTimeVeggies).toEqual(['spinach', 'broccoli']);
  });

  it('returns empty first-time veggies when weeks < 2', () => {
    activityStore.weeks = [
      {startDate: lastWeek, veggies: ['apple', 'spinach'], challenge: 'cucumber'},
    ];
    appStateStore.settings.startDate = lastWeek;

    const wrapper = mounter();
    const lastWeekData = wrapper.vm.lastWeekData as WeekData;

    expect(lastWeekData.firstTimeVeggies).toEqual([]);
  });

  it('calculates previous week count correctly', () => {
    activityStore.weeks = [
      {startDate: twoWeeksAgo, veggies: ['apple', 'carrot', 'spinach'], challenge: 'cucumber'},
      {startDate: lastWeek, veggies: ['apple', 'spinach'], challenge: 'cucumber'},
    ];
    appStateStore.settings.startDate = twoWeeksAgo;

    const wrapper = mounter();
    const lastWeekData = wrapper.vm.lastWeekData as WeekData;

    expect(lastWeekData.previousWeekCount).toBe(3);
  });

  it('handles hot streak calculation', () => {
    // Clear and create weeks with 30+ veggies to trigger hot streak
    const thirtyVeggies = take(ALL_VEGGIES, 30);
    activityStore.weeks = [
      {startDate: twoWeeksAgo, veggies: thirtyVeggies, challenge: 'cucumber'},
      {startDate: lastWeek, veggies: thirtyVeggies, challenge: 'cucumber'},
    ];
    appStateStore.settings.startDate = twoWeeksAgo;

    const wrapper = mounter();
    const lastWeekData = wrapper.vm.lastWeekData as WeekData;

    expect(lastWeekData.hotStreak).toBe(2);
  });

  it('displays three summary messages and a promoted achievement', () => {
    // Setup test data to ensure we have summary content
    const thirtyVeggies = take(ALL_VEGGIES, 30);
    activityStore.weeks = [
      {startDate: twoWeeksAgo, veggies: ['apple', 'carrot', 'spinach'], challenge: 'cucumber'},
      {startDate: lastWeek, veggies: thirtyVeggies, challenge: 'apple'},
    ];
    appStateStore.settings.startDate = twoWeeksAgo;

    const wrapper = mounter();

    const badges = wrapper.findAll('.weekSummaryBadge');
    const summaryItems = wrapper.findAll('.weekSummaryDialog__message');

    expect(summaryItems.length).toBe(3);
    expect(badges.length).toBe(3);
    expect(wrapper.findByTestId('promoted-achievement').exists()).toBe(true);
  });

  it('does not show share/copy button when no veggies were eaten', () => {
    activityStore.weeks = [{startDate: lastWeek, veggies: [], challenge: 'cucumber'}];
    appStateStore.settings.startDate = lastWeek;

    const wrapper = mounter();

    expect(wrapper.findByTestId('week-summary-dialog-share-button').exists()).toBe(false);
    expect(wrapper.findByTestId('week-summary-dialog-copy-button').exists()).toBe(false);
  });

  it('closes dialog on close button click', async () => {
    appStateStore.settings.startDate = lastWeek;
    const wrapper = mounter();

    expect(wrapper.findByTestId('week-summary-dialog').exists()).toBe(true);

    await wrapper.findByTestId('week-summary-dialog-close-button').trigger('click');

    expect(wrapper.findByTestId('week-summary-dialog').exists()).toBe(false);
    expect(wrapper.vm.lastWeekData).toBeNull();
  });

  it('copies to clipboard', async () => {
    const clipboard = navigator.clipboard;
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });

    activityStore.weeks = [
      {
        startDate: lastWeek,
        veggies: ['apple', 'spinach', 'carrot', 'tomato', 'broccoli'],
        challenge: 'cucumber',
      },
    ];
    appStateStore.settings.startDate = lastWeek;

    const wrapper = mounter();

    await wrapper.findByTestId('week-summary-dialog-copy-button').trigger('click');

    const expectedText = `I ate 5 different veggies last week
🍎: 1
🥦: 2
🥬: 1
🥕: 1
Try it out:
https://eatyourveggies.app`;

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedText);

    Object.assign(navigator, {clipboard});
  });

  it('shares', async () => {
    const share = navigator.share;
    Object.assign(navigator, {
      share: vi.fn(),
    });

    activityStore.weeks = [
      {
        startDate: lastWeek,
        veggies: ['apple', 'spinach', 'carrot', 'tomato', 'broccoli'],
        challenge: 'cucumber',
      },
    ];
    appStateStore.settings.startDate = lastWeek;

    const wrapper = mounter();

    await wrapper.findByTestId('week-summary-dialog-share-button').trigger('click');

    const expectedText = `I ate 5 different veggies last week
🍎: 1
🥦: 2
🥬: 1
🥕: 1
Try it out:`;

    expect(navigator.share).toHaveBeenCalledWith({
      text: expectedText,
      url: 'https://eatyourveggies.app',
    });

    Object.assign(navigator, {share});
  });
});
