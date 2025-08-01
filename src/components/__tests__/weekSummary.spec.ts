import {ref, computed, type ComputedRef} from 'vue';
import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import {useWeekSummary} from '@/hooks/weekSummary';
import type {WeekData} from '@/utils/types';

const withSetup = (weekData: ComputedRef<WeekData>) =>
  new Promise<ReturnType<typeof useWeekSummary>>((resolve) => {
    mount({
      shallow: true,
      template: '<div />',
      setup() {
        resolve(useWeekSummary(weekData));
      },
    });
  });

const createWeekData = (overrides: Partial<WeekData> = {}): ComputedRef<WeekData> =>
  computed(() => ({
    atMostVeggies: 10,
    challenge: undefined,
    hotStreak: 1,
    mean: 12,
    veggies: [],
    weekNumber: '1',
    ...overrides,
  }));

describe('useWeekSummary', () => {
  it('returns no veggies message when veggies array is empty', async () => {
    const weekData = createWeekData({veggies: []});
    const {summaryMessages} = await withSetup(weekData);

    expect(summaryMessages.value).toContainEqual({
      emoji: '🍽️',
      translationKey: 'weekStartDialog.noVeggies',
      translationParameters: [],
    });
  });

  it('returns record achievement message when veggies count equals atMostVeggies', async () => {
    const weekData = createWeekData({
      atMostVeggies: 3,
      veggies: ['apple', 'spinach', 'tomato'],
    });
    const {summaryMessages} = await withSetup(weekData);

    expect(summaryMessages.value).toContainEqual(
      expect.objectContaining({
        emoji: '👑',
        translationKey: 'weekStartDialog.recordAchieved',
        translationParameters: [3],
      }),
    );
  });

  it('returns hot streak message when hot streak is longer than 2 weeks', async () => {
    const weekData = createWeekData({
      hotStreak: 2,
      veggies: ['apple'], // Just need some veggies to avoid no-veggies message
    });
    const {summaryMessages} = await withSetup(weekData);

    expect(summaryMessages.value).toContainEqual(
      expect.objectContaining({
        emoji: '🔥',
        translationKey: 'weekStartDialog.hotStreak',
        translationParameters: [2],
      }),
    );
  });

  it('does not return hot streak message when hot streak is 2 or less', async () => {
    const weekData = createWeekData({
      hotStreak: 1,
      veggies: ['apple'],
    });
    const {summaryMessages} = await withSetup(weekData);

    const hotStreakMessage = summaryMessages.value.find(
      ({translationKey}) => translationKey === 'weekStartDialog.hotStreak',
    );
    expect(hotStreakMessage).toBeUndefined();
  });

  it('returns favorite category message when one category has multiple veggies', async () => {
    const weekData = createWeekData({
      veggies: ['apple', 'banana', 'grape', 'spinach'], // 3 fruits, 1 leafy
    });
    const {summaryMessages} = await withSetup(weekData);

    expect(summaryMessages.value).toContainEqual(
      expect.objectContaining({
        emoji: '⭐',
        translationKey: 'weekStartDialog.favoriteCategory',
        translationParameters: ['fruits and berries', 3],
      }),
    );
  });

  it('returns missing category messages for categories not represented', async () => {
    const weekData = createWeekData({
      veggies: ['apple', 'spinach'], // Only Fruit and Leafy categories
    });
    const {summaryMessages} = await withSetup(weekData);

    const missingCategoryMessages = summaryMessages.value.filter(
      ({translationKey}) => translationKey === 'weekStartDialog.missingCategory',
    );

    const missingCategories = missingCategoryMessages.map(
      ({translationParameters}) => translationParameters[0],
    );
    expect(missingCategories).toEqual(
      expect.arrayContaining([
        'vegetables',
        'roots and bulbs',
        'beans and legumes',
        'grains, nuts, and seeds',
        'mushrooms',
      ]),
    );
  });

  it('returns no missing category messages when all categories are present', async () => {
    const weekData = createWeekData({
      veggies: ['apple', 'spinach', 'tomato', 'carrot', 'chickpea', 'rice', 'shiitake'],
    });
    const {summaryMessages} = await withSetup(weekData);

    const missingCategoryMessages = summaryMessages.value.filter(
      ({translationKey}) => translationKey === 'weekStartDialog.missingCategory',
    );
    expect(missingCategoryMessages).toHaveLength(0);
  });

  it('combines multiple message types when conditions are met', async () => {
    const weekData = createWeekData({
      atMostVeggies: 2,
      hotStreak: 4,
      veggies: ['apple', 'spinach'], // Record + hot streak + missing categories
    });
    const {summaryMessages} = await withSetup(weekData);

    // Should contain record achievement
    expect(summaryMessages.value).toContainEqual(
      expect.objectContaining({
        translationKey: 'weekStartDialog.recordAchieved',
        translationParameters: [2],
      }),
    );

    // Should contain hot streak
    expect(summaryMessages.value).toContainEqual(
      expect.objectContaining({
        translationKey: 'weekStartDialog.hotStreak',
        translationParameters: [4],
      }),
    );

    // Should contain missing categories
    const missingCategoryMessages = summaryMessages.value.filter(
      ({translationKey}) => translationKey === 'weekStartDialog.missingCategory',
    );
    expect(missingCategoryMessages.length).toBeGreaterThan(0);
  });

  it('returns mean message when there are veggies', async () => {
    const weekData = createWeekData({
      mean: 15,
      veggies: ['apple', 'spinach', 'tomato'],
    });
    const {summaryMessages} = await withSetup(weekData);

    expect(summaryMessages.value).toContainEqual(
      expect.objectContaining({
        emoji: '📊',
        translationKey: 'weekStartDialog.mean',
        translationParameters: [15],
      }),
    );
  });

  it('returns challenge completed message when challenge veggie is in the week', async () => {
    const weekData = createWeekData({
      challenge: 'apple',
      veggies: ['apple', 'spinach', 'tomato'],
    });
    const {summaryMessages} = await withSetup(weekData);

    expect(summaryMessages.value).toContainEqual(
      expect.objectContaining({
        emoji: '🎖️',
        translationKey: 'weekStartDialog.challengeCompleted',
        translationParameters: ['apple'],
      }),
    );
  });

  it('returns challenge missed message when challenge veggie is not in the week', async () => {
    const weekData = createWeekData({
      challenge: 'apple',
      veggies: ['spinach', 'tomato'],
    });
    const {summaryMessages} = await withSetup(weekData);

    expect(summaryMessages.value).toContainEqual(
      expect.objectContaining({
        emoji: '😶‍🌫️',
        translationKey: 'weekStartDialog.challengeMissed',
        translationParameters: ['apple'],
      }),
    );
  });

  it('does not return challenge message when challenge is undefined', async () => {
    const weekData = createWeekData({
      challenge: undefined,
      veggies: ['apple', 'spinach', 'tomato'],
    });
    const {summaryMessages} = await withSetup(weekData);

    const challengeMessages = summaryMessages.value.filter(
      ({translationKey}) =>
        translationKey === 'weekStartDialog.challengeCompleted' ||
        translationKey === 'weekStartDialog.challengeMissed',
    );
    expect(challengeMessages).toHaveLength(0);
  });

  it('returns reactive messages when week data changes', async () => {
    const weekData = ref<WeekData>({
      atMostVeggies: 10,
      challenge: undefined,
      hotStreak: 1,
      mean: 5,
      veggies: ['apple'],
      weekNumber: '1',
    });
    const weekDataComputed = computed(() => weekData.value);
    const {summaryMessages} = await withSetup(weekDataComputed);

    // Initial state: should have missing categories
    expect(
      summaryMessages.value.some((msg) => msg.translationKey === 'weekStartDialog.missingCategory'),
    ).toBe(true);

    // Change to empty veggies
    weekData.value = {
      ...weekData.value,
      veggies: [],
    };
    expect(summaryMessages.value).toContainEqual(
      expect.objectContaining({
        translationKey: 'weekStartDialog.noVeggies',
      }),
    );

    // Change to record achievement
    weekData.value = {
      ...weekData.value,
      atMostVeggies: 1,
      veggies: ['apple'],
    };
    expect(summaryMessages.value).toContainEqual(
      expect.objectContaining({
        translationKey: 'weekStartDialog.recordAchieved',
      }),
    );
  });
});
