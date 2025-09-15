import {ref, type Ref} from 'vue';
import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import {take} from 'remeda';
import {useWeekSummary} from '@/hooks/weekSummary';
import type {WeekData} from '@/utils/types';
import {ALL_VEGGIES} from '@/utils/veggieDetails';
import {useAppStateStore} from '@/stores/appStateStore';

const withSetup = (weekData: Ref<WeekData>) =>
  new Promise<ReturnType<typeof useWeekSummary>>((resolve) => {
    mount({
      shallow: true,
      template: '<div />',
      setup() {
        resolve(useWeekSummary(weekData));
      },
    });
  });

const createWeekData = (overrides: Partial<WeekData> = {}): Ref<WeekData> =>
  ref({
    atMostVeggies: 10,
    challenge: undefined,
    firstTimeVeggies: [],
    firstWeek: false,
    hotStreak: 1,
    mean: 12,
    previousWeekCount: 0,
    promotedAchievement: 'goNuts',
    veggies: [],
    weekNumber: '1',
    ...overrides,
  });

describe('useWeekSummary', () => {
  it('returns no veggies message when veggies array is empty', async () => {
    const weekData = createWeekData({veggies: []});
    const {summaryMessages} = await withSetup(weekData);

    expect(summaryMessages.value).toContainEqual({
      emoji: '🍽️',
      translationKey: 'weekSummaryDialog.noVeggies',
      translationParameters: [],
    });
  });

  describe('progress messages', () => {
    it('returns room for improvement message for less than 10 veggies', async () => {
      const weekData = createWeekData({
        veggies: ['apple', 'spinach', 'tomato'],
      });
      const {summaryMessages} = await withSetup(weekData);

      expect(summaryMessages.value).toContainEqual(
        expect.objectContaining({
          emoji: '🍂',
          translationKey: 'weekSummaryDialog.roomForImprovement',
          translationParameters: [3],
        }),
      );
    });

    it('returns good start message for 10-19 veggies', async () => {
      const weekData = createWeekData({
        veggies: take(ALL_VEGGIES, 15),
      });
      const {summaryMessages} = await withSetup(weekData);

      expect(summaryMessages.value).toContainEqual(
        expect.objectContaining({
          emoji: '🌱',
          translationKey: 'weekSummaryDialog.goodStart',
          translationParameters: [15],
        }),
      );
    });

    it('returns making progress message for 20-29 veggies', async () => {
      const weekData = createWeekData({
        veggies: take(ALL_VEGGIES, 25),
      });
      const {summaryMessages} = await withSetup(weekData);

      expect(summaryMessages.value).toContainEqual(
        expect.objectContaining({
          emoji: '🥗',
          translationKey: 'weekSummaryDialog.makingProgress',
          translationParameters: [25],
        }),
      );
    });

    it('returns accomplishment message for 30+ veggies when hotStreak is 1', async () => {
      const weekData = createWeekData({
        veggies: take(ALL_VEGGIES, 30),
        hotStreak: 1,
      });
      const {summaryMessages} = await withSetup(weekData);

      expect(summaryMessages.value).toContainEqual(
        expect.objectContaining({
          emoji: '🎉',
          translationKey: 'weekSummaryDialog.accomplishment',
          translationParameters: [30],
        }),
      );
    });

    it('does not return accomplishment message for 30+ veggies when hotStreak is not 1', async () => {
      const weekData = createWeekData({
        veggies: take(ALL_VEGGIES, 35),
        hotStreak: 2,
      });
      const {summaryMessages} = await withSetup(weekData);

      expect(summaryMessages.value).not.toContainEqual(
        expect.objectContaining({
          translationKey: 'weekSummaryDialog.accomplishment',
        }),
      );
    });
  });

  describe('comparison messages', () => {
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
          translationKey: 'weekSummaryDialog.surpassedPreviousWeek',
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
          translationKey: 'weekSummaryDialog.fellShort',
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
        ({translationKey}) => translationKey === 'weekSummaryDialog.fellShort',
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
          translationKey === 'weekSummaryDialog.surpassedPreviousWeek' ||
          translationKey === 'weekSummaryDialog.fellShort',
      );
      expect(comparisonMessages).toHaveLength(0);
    });
  });

  describe('statistics messages', () => {
    it('returns mean message when there are veggies', async () => {
      const weekData = createWeekData({
        mean: 15,
        veggies: ['apple', 'spinach', 'tomato'],
      });
      const {summaryMessages} = await withSetup(weekData);

      expect(summaryMessages.value).toContainEqual(
        expect.objectContaining({
          emoji: '📊',
          translationKey: 'weekSummaryDialog.mean',
          translationParameters: [15],
        }),
      );
    });

    it('returns record achievement message when veggies count equals atMostVeggies', async () => {
      const weekData = createWeekData({
        atMostVeggies: 3,
        veggies: ['apple', 'spinach', 'tomato'],
      });
      const {summaryMessages} = await withSetup(weekData);

      expect(summaryMessages.value).toContainEqual(
        expect.objectContaining({
          emoji: '🥇',
          translationKey: 'weekSummaryDialog.recordAchieved',
          translationParameters: [3],
        }),
      );
    });

    it('returns close to record message when 2 veggies away from record', async () => {
      const weekData = createWeekData({
        atMostVeggies: 10,
        veggies: take(ALL_VEGGIES, 8),
      });
      const {summaryMessages} = await withSetup(weekData);

      expect(summaryMessages.value).toContainEqual(
        expect.objectContaining({
          emoji: '🥈',
          translationKey: 'weekSummaryDialog.closeToRecord',
          translationParameters: [2, 10],
        }),
      );
    });

    it('does not return close to record message when 3 or more veggies away', async () => {
      const weekData = createWeekData({
        atMostVeggies: 10,
        veggies: ['apple', 'spinach', 'tomato'],
      });
      const {summaryMessages} = await withSetup(weekData);

      const closeToRecordMessages = summaryMessages.value.filter(
        ({translationKey}) => translationKey === 'weekSummaryDialog.closeToRecord',
      );
      expect(closeToRecordMessages).toHaveLength(0);
    });

    it('does not return close to record message when at record', async () => {
      const weekData = createWeekData({
        atMostVeggies: 3,
        veggies: ['apple', 'spinach', 'tomato'],
      });
      const {summaryMessages} = await withSetup(weekData);

      const closeToRecordMessages = summaryMessages.value.filter(
        ({translationKey}) => translationKey === 'weekSummaryDialog.closeToRecord',
      );
      expect(closeToRecordMessages).toHaveLength(0);
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
          translationKey: 'weekSummaryDialog.hotStreak',
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
        ({translationKey}) => translationKey === 'weekSummaryDialog.hotStreak',
      );
      expect(hotStreakMessage).toBeUndefined();
    });
  });

  describe('challenge messages', () => {
    it('returns challenge completed message when challenge veggie is in the week', async () => {
      const weekData = createWeekData({
        challenge: 'apple',
        veggies: ['apple', 'spinach', 'tomato'],
      });
      const {summaryMessages} = await withSetup(weekData);

      expect(summaryMessages.value).toContainEqual(
        expect.objectContaining({
          emoji: '🎖️',
          translationKey: 'weekSummaryDialog.challengeCompleted',
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
          translationKey: 'weekSummaryDialog.challengeMissed',
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
          translationKey === 'weekSummaryDialog.challengeCompleted' ||
          translationKey === 'weekSummaryDialog.challengeMissed',
      );
      expect(challengeMessages).toHaveLength(0);
    });

    it('returns individual messages for each first-time veggie', async () => {
      const weekData = createWeekData({
        firstTimeVeggies: ['apple', 'spinach'],
        veggies: ['apple', 'spinach', 'tomato'],
      });
      const {summaryMessages} = await withSetup(weekData);

      expect(summaryMessages.value).toContainEqual(
        expect.objectContaining({
          emoji: '🆕',
          translationKey: 'weekSummaryDialog.firstTimeVeggie',
          translationParameters: ['apple'],
        }),
      );

      expect(summaryMessages.value).toContainEqual(
        expect.objectContaining({
          emoji: '🆕',
          translationKey: 'weekSummaryDialog.firstTimeVeggie',
          translationParameters: ['spinach'],
        }),
      );
    });

    it('does not return first-time veggie messages when no first-time veggies', async () => {
      const weekData = createWeekData({
        firstTimeVeggies: [],
        veggies: ['apple', 'spinach', 'tomato'],
      });
      const {summaryMessages} = await withSetup(weekData);

      const firstTimeMessages = summaryMessages.value.filter(
        ({translationKey}) => translationKey === 'weekSummaryDialog.firstTimeVeggie',
      );
      expect(firstTimeMessages).toHaveLength(0);
    });
  });

  describe('category messages', () => {
    it('returns favorite category message when one category has multiple veggies', async () => {
      const weekData = createWeekData({
        veggies: ['apple', 'banana', 'grape', 'kiwi', 'spinach'],
      });
      const {summaryMessages} = await withSetup(weekData);

      expect(summaryMessages.value).toContainEqual(
        expect.objectContaining({
          emoji: '⭐',
          translationKey: 'weekSummaryDialog.favoriteCategory',
          translationParameters: [4, 'fruits and berries'],
        }),
      );
    });

    it('does not return favorite category message when highest count is 3 or less', async () => {
      const weekData = createWeekData({
        veggies: ['apple', 'banana', 'grape', 'spinach'],
      });
      const {summaryMessages} = await withSetup(weekData);

      const favoriteCategoryMessages = summaryMessages.value.filter(
        ({translationKey}) => translationKey === 'weekSummaryDialog.favoriteCategory',
      );

      expect(favoriteCategoryMessages).toHaveLength(0);
    });

    it('returns missing category messages for categories not represented', async () => {
      const weekData = createWeekData({
        veggies: ['apple', 'spinach'], // Only Fruit and Leafy categories
      });
      const {summaryMessages} = await withSetup(weekData);

      const missingCategoryMessages = summaryMessages.value.filter(
        ({translationKey}) => translationKey === 'weekSummaryDialog.missingCategory',
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
        ({translationKey}) => translationKey === 'weekSummaryDialog.missingCategory',
      );
      expect(missingCategoryMessages).toHaveLength(0);
      expect(summaryMessages.value).toContainEqual({
        emoji: '🤹',
        translationKey: 'weekSummaryDialog.allCategories',
        translationParameters: [],
      });
    });

    it('returns low category count messages for categories with 1-2 veggies', async () => {
      const weekData = createWeekData({
        veggies: ['apple', 'banana', 'spinach', 'kale', 'quinoa'], // 2 fruits, 2 leafy, 1 grain
      });
      const {summaryMessages} = await withSetup(weekData);

      const lowCategoryMessages = summaryMessages.value.filter(
        ({translationKey}) => translationKey === 'weekSummaryDialog.lowCategoryCount',
      );

      // Should have messages for all three categories
      expect(lowCategoryMessages).toHaveLength(3);

      // Verify the complete message structure for fruits and berries (2 veggies)
      expect(lowCategoryMessages).toContainEqual({
        emoji: '🤔',
        translationKey: 'weekSummaryDialog.lowCategoryCount',
        translationParameters: [2, 'fruits and berries'],
      });

      // Verify the complete message structure for leafy greens and herbs (2 veggies)
      expect(lowCategoryMessages).toContainEqual({
        emoji: '🤔',
        translationKey: 'weekSummaryDialog.lowCategoryCount',
        translationParameters: [2, 'leafy greens and herbs'],
      });

      // Verify the complete message structure for grains, nuts, and seeds (1 veggie)
      expect(lowCategoryMessages).toContainEqual({
        emoji: '🤔',
        translationKey: 'weekSummaryDialog.lowCategoryCount',
        translationParameters: [1, 'grains, nuts, and seeds'],
      });
    });

    it('does not return low category count messages for categories with 3+ veggies', async () => {
      const weekData = createWeekData({
        veggies: ['apple', 'banana', 'grape', 'spinach'], // 3 fruits, 1 leafy
      });
      const {summaryMessages} = await withSetup(weekData);

      const lowCategoryMessages = summaryMessages.value.filter(
        ({translationKey}) => translationKey === 'weekSummaryDialog.lowCategoryCount',
      );

      expect(lowCategoryMessages).toHaveLength(1);
      expect(lowCategoryMessages[0]).toEqual({
        emoji: '🤔',
        translationKey: 'weekSummaryDialog.lowCategoryCount',
        translationParameters: [1, 'leafy greens and herbs'],
      });
    });
  });

  describe('nutrient messages', () => {
    it('returns message when 0 veggies from a nutrient group are consumed', async () => {
      const weekData = createWeekData({
        veggies: ['apple'],
      });
      const {summaryMessages} = await withSetup(weekData);

      const vitaminAMessage = summaryMessages.value.find(
        ({translationKey}) => translationKey === 'weekSummaryDialog.nutrientMessages.A',
      );
      expect(vitaminAMessage).toBeDefined();
      expect(vitaminAMessage!.emoji).toBe('💊');
    });

    it('returns message when 1 veggie from a nutrient group is consumed', async () => {
      const weekData = createWeekData({
        veggies: ['spinach'],
      });
      const {summaryMessages} = await withSetup(weekData);

      const ironMessage = summaryMessages.value.find(
        ({translationKey}) => translationKey === 'weekSummaryDialog.nutrientMessages.iron',
      );
      expect(ironMessage).toBeDefined();
      expect(ironMessage!.emoji).toBe('💊');
    });

    it('does not return message when 2 veggies from a nutrient group are consumed', async () => {
      const weekData = createWeekData({
        veggies: ['broccoli', 'spinach'],
      });
      const {summaryMessages} = await withSetup(weekData);

      const vitaminCMessage = summaryMessages.value.find(
        ({translationKey}) => translationKey === 'weekSummaryDialog.nutrientMessages.C',
      );
      expect(vitaminCMessage).toBeUndefined();
    });

    it('returns specific nutrient messages when multiple nutrients are unsatisfied', async () => {
      const weekData = createWeekData({
        veggies: ['spinach', 'broccoli'],
      });
      const {summaryMessages} = await withSetup(weekData);

      const nutrientMessages = summaryMessages.value.filter(({translationKey}) =>
        translationKey.startsWith('weekSummaryDialog.nutrientMessages.'),
      );
      expect(nutrientMessages.length).toBe(11);

      // Should NOT have calcium message
      const calciumMessage = summaryMessages.value.find(
        ({translationKey}) => translationKey === 'weekSummaryDialog.nutrientMessages.calcium',
      );
      expect(calciumMessage).toBeUndefined();

      // Should NOT have vitamin C message
      const vitaminCMessage = summaryMessages.value.find(
        ({translationKey}) => translationKey === 'weekSummaryDialog.nutrientMessages.C',
      );
      expect(vitaminCMessage).toBeUndefined();
    });

    it('excludes allergens from nutrient suggestions', async () => {
      const appStateStore = useAppStateStore();

      // Set allergens to all B7 sources except 'sweet potato'
      appStateStore.settings.allergens = [
        'almond',
        'champignon',
        'peanut',
        'portobello',
        'shiitake',
        'soybean',
      ];

      const weekData = createWeekData({
        veggies: ['apple', 'cucumber'],
      });

      const {summaryMessages} = await withSetup(weekData);

      const b7Message = summaryMessages.value.find(
        ({translationKey}) => translationKey === 'weekSummaryDialog.nutrientMessages.B7',
      );

      expect(b7Message).toBeDefined();
      expect(b7Message!.translationParameters).toEqual(['sweet potato, sunflower seed']);
    });
  });

  describe('integration tests', () => {
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
          emoji: '🥇',
          translationKey: 'weekSummaryDialog.recordAchieved',
          translationParameters: [2],
        }),
      );

      // Should contain hot streak
      expect(summaryMessages.value).toContainEqual(
        expect.objectContaining({
          translationKey: 'weekSummaryDialog.hotStreak',
          translationParameters: [4],
        }),
      );

      // Should contain missing categories
      const missingCategoryMessages = summaryMessages.value.filter(
        ({translationKey}) => translationKey === 'weekSummaryDialog.missingCategory',
      );
      expect(missingCategoryMessages.length).toBeGreaterThan(0);
    });

    it('returns reactive messages when week data changes', async () => {
      const weekData = ref<WeekData>({
        atMostVeggies: 10,
        challenge: undefined,
        firstTimeVeggies: [],
        firstWeek: false,
        hotStreak: 1,
        mean: 5,
        previousWeekCount: 0,
        promotedAchievement: 'goNuts',
        veggies: ['apple'],
        weekNumber: '1',
      });

      const {summaryMessages} = await withSetup(weekData);

      // Initial state: should have missing categories
      expect(
        summaryMessages.value.some(
          (msg) => msg.translationKey === 'weekSummaryDialog.missingCategory',
        ),
      ).toBe(true);

      // Change to empty veggies
      weekData.value = {
        ...weekData.value,
        veggies: [],
      };
      expect(summaryMessages.value).toContainEqual(
        expect.objectContaining({
          translationKey: 'weekSummaryDialog.noVeggies',
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
          emoji: '🥇',
          translationKey: 'weekSummaryDialog.recordAchieved',
        }),
      );
    });
  });
});
