import {describe, it, expect, beforeEach, vi, afterEach} from 'vitest';
import {mount, flushPromises, enableAutoUnmount} from '@vue/test-utils';
import {DialogContent} from 'reka-ui';
import {take} from '@/test-utils';
import {ALL_VEGGIES} from '@/utils/veggieDetails';
import {getWeekStart} from '@/utils/helpers';
import {Category} from '@/types';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import WeekSummaryDialog from '@/components/WeekSummaryDialog.vue';

const mocks = vi.hoisted(() => ({
  getAISummary: vi.fn((_, onChunk: (text: string) => void) => {
    onChunk('Test AI summary');
    return Promise.resolve('Test AI summary');
  }),
}));

vi.mock('@/api', () => ({
  getAISummary: mocks.getAISummary,
}));

describe('WeekSummaryDialog', () => {
  const thisWeek = getWeekStart();
  const lastWeek = thisWeek.subtract({weeks: 1});
  const twoWeeksAgo = thisWeek.subtract({weeks: 2});
  let activityStore: ReturnType<typeof useActivityStore>;
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
    appStateStore = useAppStateStore();
    mocks.getAISummary.mockClear();
  });
  enableAutoUnmount(afterEach);

  it('does not show dialog when no startDate is set', async () => {
    const wrapper = mount(WeekSummaryDialog);
    await flushPromises();
    expect(wrapper.findComponent(DialogContent).isVisible()).toBe(false);
  });

  it('does not show dialog when in the first week (startDate equals thisWeekStart)', async () => {
    appStateStore.settings.startDate = thisWeek;
    const wrapper = mount(WeekSummaryDialog);
    await flushPromises();
    expect(wrapper.findComponent(DialogContent).isVisible()).toBe(false);
  });

  it('shows dialog when not in first week and summaryViewedDate is null', async () => {
    appStateStore.settings.startDate = lastWeek;
    const wrapper = mount(WeekSummaryDialog);
    await flushPromises();
    const dialog = wrapper.getComponent(DialogContent);
    expect(dialog.isVisible()).toBe(true);
  });

  it('shows dialog when not in first week and summaryViewedDate is from previous week', async () => {
    appStateStore.settings.startDate = twoWeeksAgo;
    appStateStore.settings.summaryViewedDate = twoWeeksAgo;
    const wrapper = mount(WeekSummaryDialog);
    await flushPromises();
    const dialog = wrapper.getComponent(DialogContent);
    expect(dialog.isVisible()).toBe(true);
  });

  it('does not show dialog when summaryViewedDate is current week', async () => {
    appStateStore.settings.startDate = lastWeek;
    appStateStore.settings.summaryViewedDate = thisWeek;
    const wrapper = mount(WeekSummaryDialog);
    await flushPromises();
    expect(wrapper.findComponent(DialogContent).isVisible()).toBe(false);
  });

  it('does not show dialog when summaryViewedDate is in a future week', async () => {
    appStateStore.settings.startDate = lastWeek;
    appStateStore.settings.summaryViewedDate = thisWeek.add({weeks: 1});
    const wrapper = mount(WeekSummaryDialog);
    await flushPromises();
    expect(wrapper.findComponent(DialogContent).isVisible()).toBe(false);
  });

  it('displays three summary messages and a promoted achievement', async () => {
    const thirtyVeggies = take(ALL_VEGGIES, 30);
    activityStore.weeks = [
      {startDate: twoWeeksAgo, veggies: ['apple', 'carrot', 'spinach'], challenge: 'cucumber'},
      {startDate: lastWeek, veggies: thirtyVeggies, challenge: 'apple'},
    ];
    appStateStore.settings.startDate = twoWeeksAgo;

    const wrapper = mount(WeekSummaryDialog);
    await flushPromises();
    const dialog = wrapper.getComponent(DialogContent);

    expect(dialog.isVisible()).toBe(true);
    expect(dialog.findAll('.weekSummaryBadge').length).toBe(3);
    expect(dialog.findAll('.weekSummaryDialog__message').length).toBe(3);
    expect(dialog.findByTestId('promoted-achievement').isVisible()).toBe(true);
  });

  it('does not show share/copy button when no veggies were eaten', async () => {
    activityStore.weeks = [{startDate: lastWeek, veggies: [], challenge: 'cucumber'}];
    appStateStore.settings.startDate = lastWeek;

    const wrapper = mount(WeekSummaryDialog);
    await flushPromises();
    const dialog = wrapper.getComponent(DialogContent);
    expect(dialog.isVisible()).toBe(true);

    expect(dialog.findByTestId('week-summary-dialog-share-button').exists()).toBe(false);
    expect(dialog.findByTestId('week-summary-dialog-copy-button').exists()).toBe(false);
  });

  it('closes dialog on close button click', async () => {
    appStateStore.settings.startDate = lastWeek;
    const wrapper = mount(WeekSummaryDialog);
    await flushPromises();

    const dialog = wrapper.getComponent(DialogContent);
    expect(dialog.isVisible()).toBe(true);
    await dialog.findByTestId('week-summary-dialog-close-button').trigger('click');

    expect(wrapper.findComponent(DialogContent).isVisible()).toBe(false);
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

    const wrapper = mount(WeekSummaryDialog);
    await flushPromises();
    const dialog = wrapper.getComponent(DialogContent);
    expect(dialog.isVisible()).toBe(true);
    await dialog.findByTestId('week-summary-dialog-copy-button').trigger('click');

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

    const wrapper = mount(WeekSummaryDialog);
    await flushPromises();
    const dialog = wrapper.getComponent(DialogContent);
    expect(dialog.isVisible()).toBe(true);
    await dialog.findByTestId('week-summary-dialog-share-button').trigger('click');

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

  it('does not show AI summary toggle when AIAllowed is false', async () => {
    appStateStore.settings.startDate = lastWeek;
    appStateStore.settings.AIAllowed = false;
    const wrapper = mount(WeekSummaryDialog);
    await flushPromises();

    const dialog = wrapper.getComponent(DialogContent);
    expect(dialog.findByTestId('show-ai-summary-button').exists()).toBe(false);
    expect(mocks.getAISummary).not.toHaveBeenCalled();
  });

  it('shows permission dialog when AI tab is clicked and AIAllowed is null', async () => {
    appStateStore.settings.startDate = lastWeek;
    appStateStore.settings.AIAllowed = null;
    const wrapper = mount(WeekSummaryDialog);
    await flushPromises();

    const dialog = wrapper.getComponent(DialogContent);
    await dialog.findByTestId('show-ai-summary-button').trigger('click');
    await flushPromises();

    const permissionDialog = wrapper
      .findAllComponents(DialogContent)
      .find((d) => d.findByTestId('ai-permission-allow-button').exists())!;
    expect(permissionDialog.isVisible()).toBe(true);
    expect(mocks.getAISummary).not.toHaveBeenCalled();
  });

  it('shows AI summary after permission is allowed', async () => {
    activityStore.weeks = [
      {startDate: lastWeek, veggies: ['apple', 'spinach'], challenge: 'cucumber'},
    ];
    appStateStore.settings.startDate = lastWeek;
    appStateStore.settings.AIAllowed = null;
    const wrapper = mount(WeekSummaryDialog);
    await flushPromises();

    const dialog = wrapper.getComponent(DialogContent);
    await dialog.findByTestId('show-ai-summary-button').trigger('click');
    await flushPromises();

    const permissionDialog = wrapper
      .findAllComponents(DialogContent)
      .find((d) => d.findByTestId('ai-permission-allow-button').exists())!;

    await permissionDialog.findByTestId('ai-permission-allow-button').trigger('click');
    await vi.dynamicImportSettled();

    expect(dialog.findByTestId('ai-summary').text()).toContain('Test AI summary');
    expect(mocks.getAISummary).toHaveBeenCalledExactlyOnceWith(
      {
        atMostVeggies: 2,
        categoryCounts: {[Category.Fruit]: 1, [Category.Leafy]: 1},
        challenge: 'cucumber',
        favoriteCategory: Category.Fruit,
        firstTimeVeggies: [],
        firstWeek: true,
        hotStreak: 0,
        mean: 2,
        missingCategories: [
          Category.Vegetable,
          Category.Root,
          Category.Bean,
          Category.Grain,
          Category.Mushroom,
        ],
        previousWeekCount: 0,
        veggies: ['apple', 'spinach'],
        weekNumber: lastWeek.weekOfYear,
      },
      expect.any(Function),
      expect.any(AbortSignal),
    );
  });

  it('shows AI summary when AIAllowed is true and AI tab is clicked', async () => {
    activityStore.weeks = [
      {startDate: lastWeek, veggies: ['apple', 'spinach'], challenge: 'cucumber'},
    ];
    appStateStore.settings.startDate = lastWeek;
    appStateStore.settings.AIAllowed = true;
    const wrapper = mount(WeekSummaryDialog);
    await flushPromises();

    const dialog = wrapper.getComponent(DialogContent);
    await dialog.findByTestId('show-ai-summary-button').trigger('click');
    await vi.dynamicImportSettled();

    expect(dialog.findByTestId('ai-summary').text()).toContain('Test AI summary');
    expect(mocks.getAISummary).toHaveBeenCalledExactlyOnceWith(
      {
        atMostVeggies: 2,
        categoryCounts: {[Category.Fruit]: 1, [Category.Leafy]: 1},
        challenge: 'cucumber',
        favoriteCategory: Category.Fruit,
        firstTimeVeggies: [],
        firstWeek: true,
        hotStreak: 0,
        mean: 2,
        missingCategories: [
          Category.Vegetable,
          Category.Root,
          Category.Bean,
          Category.Grain,
          Category.Mushroom,
        ],
        previousWeekCount: 0,
        veggies: ['apple', 'spinach'],
        weekNumber: lastWeek.weekOfYear,
      },
      expect.any(Function),
      expect.any(AbortSignal),
    );
  });
});
