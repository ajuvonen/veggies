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
    firstWeek: false,
    hotStreak: 1,
    mean: 12,
    previousWeekCount: 0,
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

  it('returns surpassed previous week message when current count is higher', async () => {
    const weekData = createWeekData({
      firstWeek: false,
      previousWeekCount: 5,
      veggies: ['apple', 'spinach', 'tomato', 'carrot', 'broccoli', 'peas'],
    });
    const {summaryMessages} = await withSetup(weekData);

    expect(summaryMessages.value).toContainEqual(
      expect.objectContaining({
        emoji: '📈',
        translationKey: 'weekStartDialog.surpassedPreviousWeek',
        translationParameters: [5],
      }),
    );
  });

  it('returns fell short message when current count is more than 3 less than previous', async () => {
    const weekData = createWeekData({
      firstWeek: false,
      previousWeekCount: 10,
      veggies: ['apple', 'spinach', 'tomato'],
    });
    const {summaryMessages} = await withSetup(weekData);

    expect(summaryMessages.value).toContainEqual(
      expect.objectContaining({
        emoji: '📉',
        translationKey: 'weekStartDialog.fellShort',
        translationParameters: [10],
      }),
    );
  });

  it('does not return fell short message when difference is 3 or less', async () => {
    const weekData = createWeekData({
      firstWeek: false,
      previousWeekCount: 8,
      veggies: ['apple', 'spinach', 'tomato', 'carrot', 'broccoli'],
    });
    const {summaryMessages} = await withSetup(weekData);

    const fellShortMessages = summaryMessages.value.filter(
      ({translationKey}) => translationKey === 'weekStartDialog.fellShort',
    );
    expect(fellShortMessages).toHaveLength(0);
  });

  it('does not return comparison messages for first week', async () => {
    const weekData = createWeekData({
      firstWeek: true,
      previousWeekCount: 0,
      veggies: ['apple', 'spinach', 'tomato', 'carrot', 'broccoli', 'peas'],
    });
    const {summaryMessages} = await withSetup(weekData);

    const comparisonMessages = summaryMessages.value.filter(
      ({translationKey}) =>
        translationKey === 'weekStartDialog.surpassedPreviousWeek' ||
        translationKey === 'weekStartDialog.fellShort',
    );
    expect(comparisonMessages).toHaveLength(0);
  });

  it('returns low category count messages for categories with 1-3 veggies', async () => {
    const weekData = createWeekData({
      veggies: ['apple', 'banana', 'spinach', 'kale', 'quinoa'], // 2 fruits, 2 leafy, 1 grain
    });
    const {summaryMessages} = await withSetup(weekData);

    const lowCategoryMessages = summaryMessages.value.filter(
      ({translationKey}) => translationKey === 'weekStartDialog.lowCategoryCount',
    );

    // Should have messages for all three categories
    expect(lowCategoryMessages).toHaveLength(3);

    // Verify the complete message structure for fruits and berries (2 veggies)
    expect(lowCategoryMessages).toContainEqual({
      emoji: '🤔',
      translationKey: 'weekStartDialog.lowCategoryCount',
      translationParameters: [2, 'fruits and berries'],
    });

    // Verify the complete message structure for leafy greens and herbs (2 veggies)
    expect(lowCategoryMessages).toContainEqual({
      emoji: '🤔',
      translationKey: 'weekStartDialog.lowCategoryCount',
      translationParameters: [2, 'leafy greens and herbs'],
    });

    // Verify the complete message structure for grains, nuts, and seeds (1 veggie)
    expect(lowCategoryMessages).toContainEqual({
      emoji: '🤔',
      translationKey: 'weekStartDialog.lowCategoryCount',
      translationParameters: [1, 'grains, nuts, and seeds'],
    });
  });

  it('does not return low category count messages for categories with 4+ veggies', async () => {
    const weekData = createWeekData({
      veggies: ['apple', 'banana', 'grape', 'orange', 'spinach'], // 4 fruits, 1 leafy
    });
    const {summaryMessages} = await withSetup(weekData);

    const lowCategoryMessages = summaryMessages.value.filter(
      ({translationKey}) => translationKey === 'weekStartDialog.lowCategoryCount',
    );

    // Should only have message for leafy category (1 veggie), not fruits (4 veggies)
    expect(lowCategoryMessages).toHaveLength(1);

    // Verify the complete message structure for the leafy category only
    expect(lowCategoryMessages[0]).toEqual({
      emoji: '🤔',
      translationKey: 'weekStartDialog.lowCategoryCount',
      translationParameters: [1, 'leafy greens and herbs'],
    });

    // Verify that no message exists for fruits category (which has 4 veggies)
    const fruitMessages = lowCategoryMessages.filter(
      (msg) => msg.translationParameters[1] === 'fruits and berries',
    );
    expect(fruitMessages).toHaveLength(0);
  });

  it('returns reactive messages when week data changes', async () => {
    const weekData = ref<WeekData>({
      atMostVeggies: 10,
      challenge: undefined,
      firstWeek: false,
      hotStreak: 1,
      mean: 5,
      previousWeekCount: 0,
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
