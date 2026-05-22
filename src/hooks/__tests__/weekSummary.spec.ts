import {describe, it, expect, beforeEach} from 'vitest';
import {useWeekSummary} from '@/hooks/weekSummary';
import {ALL_VEGGIES} from '@/utils/veggieDetails';
import {getWeekStart} from '@/utils/helpers';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import {withSetup, take} from '@/test-utils';

describe('useWeekSummary', () => {
  const thisWeek = getWeekStart();
  const lastWeek = thisWeek.subtract({weeks: 1});
  const twoWeeksAgo = thisWeek.subtract({weeks: 2});
  const threeWeeksAgo = thisWeek.subtract({weeks: 3});
  const fourWeeksAgo = thisWeek.subtract({weeks: 4});
  const fiveWeeksAgo = thisWeek.subtract({weeks: 5});
  let activityStore: ReturnType<typeof useActivityStore>;
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
    appStateStore = useAppStateStore();
    // startDate must be set for getWeekStarts to cover past weeks (needed for hotStreak)
    appStateStore.settings.startDate = fiveWeeksAgo;
  });

  const addWeek = (weekStart: Temporal.PlainDate, veggies: string[], challenge = 'cucumber') => {
    activityStore.weeks.push({startDate: weekStart, veggies, challenge});
  };

  describe('weekData computation', () => {
    it('computes veggies for last week', () => {
      addWeek(lastWeek, ['apple', 'spinach', 'tomato']);
      const {weekData} = withSetup(useWeekSummary);
      expect(weekData.value.veggies).toEqual(['apple', 'spinach', 'tomato']);
    });

    it('computes weekNumber correctly', () => {
      addWeek(lastWeek, ['apple']);
      const {weekData} = withSetup(useWeekSummary);
      expect(weekData.value.weekNumber).toBe(lastWeek.weekOfYear);
    });

    it('computes atMostVeggies as max across all weeks', () => {
      addWeek(twoWeeksAgo, ['apple', 'spinach', 'tomato']);
      addWeek(lastWeek, ['apple', 'spinach']);
      const {weekData} = withSetup(useWeekSummary);
      expect(weekData.value.atMostVeggies).toBe(3);
    });

    it('identifies first week when only one week exists', () => {
      addWeek(lastWeek, ['apple']);
      const {weekData} = withSetup(useWeekSummary);
      expect(weekData.value.firstWeek).toBe(true);
    });

    it('identifies non-first week when multiple weeks exist', () => {
      addWeek(twoWeeksAgo, ['spinach']);
      addWeek(lastWeek, ['apple']);
      const {weekData} = withSetup(useWeekSummary);
      expect(weekData.value.firstWeek).toBe(false);
    });

    it('calculates mean from past 5 weeks', () => {
      for (let i = 0; i < 7; i++) {
        const veggieCount = (i + 1) * 2;
        activityStore.weeks.push({
          startDate: thisWeek.subtract({weeks: i}),
          veggies: take(ALL_VEGGIES, veggieCount),
          challenge: 'cucumber',
        });
      }
      const {weekData} = withSetup(useWeekSummary);
      // Past 5 weeks (i=1 to i=5): 4, 6, 8, 10, 12 → mean = 8
      expect(weekData.value.mean).toBe(8);
    });

    it('calculates mean from fewer than 5 weeks when less data exists', () => {
      addWeek(twoWeeksAgo, ['apple', 'spinach']);
      addWeek(lastWeek, ['apple', 'spinach', 'tomato', 'carrot']);
      const {weekData} = withSetup(useWeekSummary);
      // 5 calendar weeks (startDate = fiveWeeksAgo), but only 2 with data: [4, 2, 0, 0, 0] → mean = 1.2
      expect(weekData.value.mean).toBe(1.2);
    });

    it('rounds mean to one decimal place', () => {
      activityStore.weeks.push({
        startDate: threeWeeksAgo,
        veggies: ['apple', 'spinach', 'tomato', 'carrot'],
        challenge: 'cucumber',
      });
      addWeek(twoWeeksAgo, ['apple', 'spinach', 'tomato']);
      addWeek(lastWeek, ['apple', 'spinach', 'tomato']);
      const {weekData} = withSetup(useWeekSummary);
      // 5 calendar weeks: [3, 3, 4, 0, 0] → mean = 10/5 = 2 → rounded to 2
      expect(weekData.value.mean).toBe(2);
    });

    it('finds challenge for last week', () => {
      activityStore.weeks.push({
        startDate: lastWeek,
        veggies: ['apple', 'spinach'],
        challenge: 'apple',
      });
      const {weekData} = withSetup(useWeekSummary);
      expect(weekData.value.challenge).toBe('apple');
    });

    it('returns null challenge when no week data exists', () => {
      const {weekData} = withSetup(useWeekSummary);
      expect(weekData.value.challenge).toBeNull();
    });

    it('identifies first-time veggies when weeks >= 2', () => {
      addWeek(twoWeeksAgo, ['apple', 'carrot']);
      addWeek(lastWeek, ['apple', 'spinach', 'broccoli']);
      const {weekData} = withSetup(useWeekSummary);
      expect(weekData.value.firstTimeVeggies).toEqual(['spinach', 'broccoli']);
    });

    it('returns empty firstTimeVeggies when only one week exists', () => {
      addWeek(lastWeek, ['apple', 'spinach']);
      const {weekData} = withSetup(useWeekSummary);
      expect(weekData.value.firstTimeVeggies).toEqual([]);
    });

    it('calculates previousWeekCount', () => {
      addWeek(twoWeeksAgo, ['apple', 'carrot', 'spinach']);
      addWeek(lastWeek, ['apple', 'spinach']);
      const {weekData} = withSetup(useWeekSummary);
      expect(weekData.value.previousWeekCount).toBe(3);
    });

    it('calculates hotStreak from consecutive 30+ veggie weeks', () => {
      const thirtyVeggies = take(ALL_VEGGIES, 30);
      activityStore.weeks.push({
        startDate: twoWeeksAgo,
        veggies: thirtyVeggies,
        challenge: 'cucumber',
      });
      activityStore.weeks.push({
        startDate: lastWeek,
        veggies: thirtyVeggies,
        challenge: 'cucumber',
      });
      const {weekData} = withSetup(useWeekSummary);
      expect(weekData.value.hotStreak).toBe(2);
    });

    it('computes categoryCounts from veggies', () => {
      addWeek(lastWeek, ['apple', 'spinach', 'tomato']);
      const {weekData} = withSetup(useWeekSummary);
      expect(weekData.value.categoryCounts).toMatchObject({Fruit: 1, Leafy: 1, Vegetable: 1});
    });

    it('computes missingCategories', () => {
      addWeek(lastWeek, ['apple', 'spinach']);
      const {weekData} = withSetup(useWeekSummary);
      expect(weekData.value.missingCategories).toEqual(
        expect.arrayContaining(['Vegetable', 'Root', 'Bean', 'Grain', 'Mushroom']),
      );
      expect(weekData.value.missingCategories).not.toContain('Fruit');
      expect(weekData.value.missingCategories).not.toContain('Leafy');
    });

    it('computes favoriteCategory as category with most veggies', () => {
      addWeek(lastWeek, ['apple', 'banana', 'grape', 'spinach']);
      const {weekData} = withSetup(useWeekSummary);
      expect(weekData.value.favoriteCategory).toBe('Fruit');
    });

    it('returns null favoriteCategory when no veggies', () => {
      const {weekData} = withSetup(useWeekSummary);
      expect(weekData.value.favoriteCategory).toBeNull();
    });

    it('identifies staples as veggies eaten in 4 of 5 past weeks', () => {
      addWeek(fiveWeeksAgo, ['spinach']);
      addWeek(fourWeeksAgo, ['apple', 'spinach']);
      addWeek(threeWeeksAgo, ['apple', 'spinach']);
      addWeek(twoWeeksAgo, ['apple', 'spinach']);
      addWeek(lastWeek, ['apple', 'spinach']);
      const {weekData} = withSetup(useWeekSummary);
      expect(weekData.value.staples).toContain('apple');
      expect(weekData.value.staples).toContain('spinach');
    });

    it('does not include veggies eaten in only 3 of 5 past weeks', () => {
      addWeek(fiveWeeksAgo, []);
      addWeek(fourWeeksAgo, []);
      addWeek(threeWeeksAgo, ['apple']);
      addWeek(twoWeeksAgo, ['apple']);
      addWeek(lastWeek, ['apple']);
      const {weekData} = withSetup(useWeekSummary);
      expect(weekData.value.staples).not.toContain('apple');
    });

    it('identifies staple when only 4 weeks recorded and veggie appears in all 4', () => {
      appStateStore.settings.startDate = fourWeeksAgo;
      addWeek(fourWeeksAgo, ['apple']);
      addWeek(threeWeeksAgo, ['apple']);
      addWeek(twoWeeksAgo, ['apple']);
      addWeek(lastWeek, ['apple']);
      const {weekData} = withSetup(useWeekSummary);
      expect(weekData.value.staples).toContain('apple');
    });

    it('returns empty rarities when veggie was not eaten before (only first-time appearance)', () => {
      addWeek(threeWeeksAgo, ['carrot']);
      addWeek(twoWeeksAgo, ['carrot']);
      addWeek(lastWeek, ['apple', 'carrot']);
      const {weekData} = withSetup(useWeekSummary);
      expect(weekData.value.rarities).toEqual([]);
    });

    it('identifies rarity as veggie appearing only in last week out of 5, eaten before', () => {
      addWeek(fiveWeeksAgo, ['carrot']);
      addWeek(fourWeeksAgo, ['carrot']);
      addWeek(threeWeeksAgo, ['carrot']);
      addWeek(twoWeeksAgo, ['carrot']);
      // apple was eaten long ago (allVeggies count > 1) but not in the past 5 weeks except now
      activityStore.weeks.unshift({
        startDate: thisWeek.subtract({weeks: 10}),
        veggies: ['apple'],
        challenge: 'cucumber',
      });
      addWeek(lastWeek, ['apple', 'carrot']);
      const {weekData} = withSetup(useWeekSummary);
      expect(weekData.value.rarities).toContain('apple');
    });

    it('does not include first-time veggies in rarities', () => {
      addWeek(fiveWeeksAgo, ['carrot']);
      addWeek(fourWeeksAgo, ['carrot']);
      addWeek(threeWeeksAgo, ['carrot']);
      addWeek(twoWeeksAgo, ['carrot']);
      addWeek(lastWeek, ['apple', 'carrot']);
      const {weekData} = withSetup(useWeekSummary);
      expect(weekData.value.rarities).not.toContain('apple');
    });

    it('does not include veggies appearing 2+ times in past 5 weeks in rarities', () => {
      addWeek(fiveWeeksAgo, ['apple']);
      addWeek(fourWeeksAgo, ['apple']);
      addWeek(threeWeeksAgo, []);
      addWeek(twoWeeksAgo, []);
      addWeek(lastWeek, ['apple']);
      const {weekData} = withSetup(useWeekSummary);
      expect(weekData.value.rarities).not.toContain('apple');
    });
  });

  describe('summary messages', () => {
    it('returns no veggies message when veggies array is empty', () => {
      addWeek(lastWeek, []);
      const {summaryMessages} = withSetup(useWeekSummary);
      expect(summaryMessages.value).toContainEqual({
        emoji: '🍽️',
        translationKey: 'weekSummaryDialog.noVeggies',
        translationParameters: [],
      });
    });

    describe('progress messages', () => {
      it('returns room for improvement message for less than 10 veggies', () => {
        addWeek(lastWeek, ['apple', 'spinach', 'tomato']);
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(summaryMessages.value).toContainEqual({
          emoji: '🍂',
          translationKey: 'weekSummaryDialog.roomForImprovement',
          translationParameters: [3],
        });
      });

      it('returns good start message for 10-19 veggies', () => {
        addWeek(lastWeek, take(ALL_VEGGIES, 15));
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(summaryMessages.value).toContainEqual({
          emoji: '🌱',
          translationKey: 'weekSummaryDialog.goodStart',
          translationParameters: [15],
        });
      });

      it('returns making progress message for 20-29 veggies', () => {
        addWeek(lastWeek, take(ALL_VEGGIES, 25));
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(summaryMessages.value).toContainEqual({
          emoji: '🥗',
          translationKey: 'weekSummaryDialog.makingProgress',
          translationParameters: [25],
        });
      });

      it('returns accomplishment message for 30+ veggies when hotStreak is 1', () => {
        addWeek(lastWeek, take(ALL_VEGGIES, 30));
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(summaryMessages.value).toContainEqual({
          emoji: '🎉',
          translationKey: 'weekSummaryDialog.accomplishment',
          translationParameters: [30],
        });
      });

      it('does not return accomplishment message for 30+ veggies when hotStreak is not 1', () => {
        const thirtyVeggies = take(ALL_VEGGIES, 30);
        activityStore.weeks.push({
          startDate: twoWeeksAgo,
          veggies: thirtyVeggies,
          challenge: 'cucumber',
        });
        addWeek(lastWeek, take(ALL_VEGGIES, 35));
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(summaryMessages.value).not.toContainEqual(
          expect.objectContaining({translationKey: 'weekSummaryDialog.accomplishment'}),
        );
      });
    });

    describe('comparison messages', () => {
      it('returns surpassed previous week message when current count is higher', () => {
        addWeek(twoWeeksAgo, take(ALL_VEGGIES, 5));
        addWeek(lastWeek, take(ALL_VEGGIES, 6));
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(summaryMessages.value).toContainEqual({
          emoji: '📈',
          translationKey: 'weekSummaryDialog.surpassedPreviousWeek',
          translationParameters: [5],
        });
      });

      it('returns fell short message when current count is more than 3 less than previous', () => {
        addWeek(twoWeeksAgo, take(ALL_VEGGIES, 10));
        addWeek(lastWeek, ['apple', 'spinach', 'tomato']);
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(summaryMessages.value).toContainEqual({
          emoji: '📉',
          translationKey: 'weekSummaryDialog.fellShort',
          translationParameters: [10],
        });
      });

      it('does not return fell short message when difference is 3 or less', () => {
        addWeek(twoWeeksAgo, take(ALL_VEGGIES, 8));
        addWeek(lastWeek, take(ALL_VEGGIES, 5));
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(
          summaryMessages.value.filter(
            ({translationKey}) => translationKey === 'weekSummaryDialog.fellShort',
          ),
        ).toHaveLength(0);
      });

      it('does not return comparison messages for first week', () => {
        addWeek(lastWeek, take(ALL_VEGGIES, 6));
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(
          summaryMessages.value.filter(
            ({translationKey}) =>
              translationKey === 'weekSummaryDialog.surpassedPreviousWeek' ||
              translationKey === 'weekSummaryDialog.fellShort',
          ),
        ).toHaveLength(0);
      });
    });

    describe('statistics messages', () => {
      it('returns mean message when there are veggies', () => {
        addWeek(lastWeek, ['apple', 'spinach', 'tomato']);
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(summaryMessages.value).toContainEqual(
          expect.objectContaining({
            emoji: '📊',
            translationKey: 'weekSummaryDialog.mean',
          }),
        );
      });

      it('returns record achievement message when veggies count equals atMostVeggies', () => {
        addWeek(lastWeek, ['apple', 'spinach', 'tomato']);
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(summaryMessages.value).toContainEqual({
          emoji: '🥇',
          translationKey: 'weekSummaryDialog.recordAchieved',
          translationParameters: [3],
        });
      });

      it('returns close to record message when 2 veggies away from record', () => {
        activityStore.weeks.push({
          startDate: threeWeeksAgo,
          veggies: take(ALL_VEGGIES, 10),
          challenge: 'cucumber',
        });
        addWeek(lastWeek, take(ALL_VEGGIES, 8));
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(summaryMessages.value).toContainEqual({
          emoji: '🥈',
          translationKey: 'weekSummaryDialog.closeToRecord',
          translationParameters: [2, 10],
        });
      });

      it('does not return close to record message when 3 or more veggies away', () => {
        activityStore.weeks.push({
          startDate: threeWeeksAgo,
          veggies: take(ALL_VEGGIES, 10),
          challenge: 'cucumber',
        });
        addWeek(lastWeek, ['apple', 'spinach', 'tomato']);
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(
          summaryMessages.value.filter(
            ({translationKey}) => translationKey === 'weekSummaryDialog.closeToRecord',
          ),
        ).toHaveLength(0);
      });

      it('does not return close to record message when at record', () => {
        addWeek(lastWeek, ['apple', 'spinach', 'tomato']);
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(
          summaryMessages.value.filter(
            ({translationKey}) => translationKey === 'weekSummaryDialog.closeToRecord',
          ),
        ).toHaveLength(0);
      });

      it('returns hot streak message when hot streak is 2 or more weeks', () => {
        const thirtyVeggies = take(ALL_VEGGIES, 30);
        activityStore.weeks.push({
          startDate: twoWeeksAgo,
          veggies: thirtyVeggies,
          challenge: 'cucumber',
        });
        activityStore.weeks.push({
          startDate: lastWeek,
          veggies: thirtyVeggies,
          challenge: 'cucumber',
        });
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(summaryMessages.value).toContainEqual({
          emoji: '🔥',
          translationKey: 'weekSummaryDialog.hotStreak',
          translationParameters: [2],
        });
      });

      it('does not return hot streak message when hot streak is 1', () => {
        addWeek(lastWeek, take(ALL_VEGGIES, 30));
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(
          summaryMessages.value.find(
            ({translationKey}) => translationKey === 'weekSummaryDialog.hotStreak',
          ),
        ).toBeUndefined();
      });
    });

    describe('challenge messages', () => {
      it('returns challenge completed message when challenge veggie is in the week', () => {
        activityStore.weeks.push({
          startDate: lastWeek,
          veggies: ['apple', 'spinach', 'tomato'],
          challenge: 'apple',
        });
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(summaryMessages.value).toContainEqual({
          emoji: '🎖️',
          translationKey: 'weekSummaryDialog.challengeCompleted',
          translationParameters: ['apple'],
        });
      });

      it('returns challenge missed message when challenge veggie is not in the week', () => {
        activityStore.weeks.push({
          startDate: lastWeek,
          veggies: ['spinach', 'tomato'],
          challenge: 'apple',
        });
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(summaryMessages.value).toContainEqual({
          emoji: '😶‍🌫️',
          translationKey: 'weekSummaryDialog.challengeMissed',
          translationParameters: ['apple'],
        });
      });

      it('does not return challenge message when no challenge is set', () => {
        activityStore.weeks.push({
          startDate: lastWeek,
          veggies: ['apple', 'spinach', 'tomato'],
          challenge: '',
        });
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(
          summaryMessages.value.filter(
            ({translationKey}) =>
              translationKey === 'weekSummaryDialog.challengeCompleted' ||
              translationKey === 'weekSummaryDialog.challengeMissed',
          ),
        ).toHaveLength(0);
      });

      it('returns individual messages for each first-time veggie', () => {
        addWeek(twoWeeksAgo, ['tomato']);
        addWeek(lastWeek, ['apple', 'spinach', 'tomato']);
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(summaryMessages.value).toContainEqual({
          emoji: '🆕',
          translationKey: 'weekSummaryDialog.firstTimeVeggie',
          translationParameters: ['apple'],
        });
        expect(summaryMessages.value).toContainEqual({
          emoji: '🆕',
          translationKey: 'weekSummaryDialog.firstTimeVeggie',
          translationParameters: ['spinach'],
        });
      });

      it('does not return first-time veggie messages when no first-time veggies', () => {
        addWeek(lastWeek, ['apple', 'spinach', 'tomato']);
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(
          summaryMessages.value.filter(
            ({translationKey}) => translationKey === 'weekSummaryDialog.firstTimeVeggie',
          ),
        ).toHaveLength(0);
      });
    });

    describe('category messages', () => {
      it('returns favorite category message when one category has 4 or more veggies', () => {
        addWeek(lastWeek, ['apple', 'banana', 'grape', 'kiwi', 'spinach']);
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(summaryMessages.value).toContainEqual({
          emoji: '⭐',
          translationKey: 'weekSummaryDialog.favoriteCategory',
          translationParameters: [4, 'fruits and berries'],
        });
      });

      it('does not return favorite category message when highest count is 3 or less', () => {
        addWeek(lastWeek, ['apple', 'banana', 'grape', 'spinach']);
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(
          summaryMessages.value.filter(
            ({translationKey}) => translationKey === 'weekSummaryDialog.favoriteCategory',
          ),
        ).toHaveLength(0);
      });

      it('returns missing category messages for categories not represented', () => {
        addWeek(lastWeek, ['apple', 'spinach']);
        const {summaryMessages} = withSetup(useWeekSummary);
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

      it('returns no missing category messages when all categories are present', () => {
        addWeek(lastWeek, ['apple', 'spinach', 'tomato', 'carrot', 'chickpea', 'rice', 'shiitake']);
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(
          summaryMessages.value.filter(
            ({translationKey}) => translationKey === 'weekSummaryDialog.missingCategory',
          ),
        ).toHaveLength(0);
        expect(summaryMessages.value).toContainEqual({
          emoji: '🤹',
          translationKey: 'weekSummaryDialog.allCategories',
          translationParameters: [],
        });
      });

      it('returns low category count messages for categories with 1-2 veggies', () => {
        addWeek(lastWeek, ['apple', 'banana', 'spinach', 'kale', 'quinoa']);
        const {summaryMessages} = withSetup(useWeekSummary);
        const lowCategoryMessages = summaryMessages.value.filter(
          ({translationKey}) => translationKey === 'weekSummaryDialog.lowCategoryCount',
        );
        expect(lowCategoryMessages).toHaveLength(3);
        expect(lowCategoryMessages).toContainEqual({
          emoji: '🤔',
          translationKey: 'weekSummaryDialog.lowCategoryCount',
          translationParameters: [2, 'fruits and berries'],
        });
        expect(lowCategoryMessages).toContainEqual({
          emoji: '🤔',
          translationKey: 'weekSummaryDialog.lowCategoryCount',
          translationParameters: [2, 'leafy greens and herbs'],
        });
        expect(lowCategoryMessages).toContainEqual({
          emoji: '🤔',
          translationKey: 'weekSummaryDialog.lowCategoryCount',
          translationParameters: [1, 'grains, nuts, and seeds'],
        });
      });

      it('does not return low category count messages for categories with 3+ veggies', () => {
        addWeek(lastWeek, ['apple', 'banana', 'grape', 'spinach']);
        const {summaryMessages} = withSetup(useWeekSummary);
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
      it('returns message when 0 veggies from a nutrient group are consumed', () => {
        addWeek(lastWeek, ['apple']);
        const {summaryMessages} = withSetup(useWeekSummary);
        const vitaminAMessage = summaryMessages.value.find(
          ({translationKey}) => translationKey === 'weekSummaryDialog.nutrientMessages.A',
        );
        expect(vitaminAMessage).toBeDefined();
        expect(vitaminAMessage!.emoji).toBe('🧑‍⚕️');
      });

      it('returns message when 1 veggie from a nutrient group is consumed', () => {
        addWeek(lastWeek, ['spinach']);
        const {summaryMessages} = withSetup(useWeekSummary);
        const ironMessage = summaryMessages.value.find(
          ({translationKey}) => translationKey === 'weekSummaryDialog.nutrientMessages.iron',
        );
        expect(ironMessage).toBeDefined();
        expect(ironMessage!.emoji).toBe('🧑‍⚕️');
      });

      it('does not return message when 2 veggies from a nutrient group are consumed', () => {
        addWeek(lastWeek, ['broccoli', 'spinach']);
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(
          summaryMessages.value.find(
            ({translationKey}) => translationKey === 'weekSummaryDialog.nutrientMessages.C',
          ),
        ).toBeUndefined();
      });

      it('returns specific nutrient messages when multiple nutrients are unsatisfied', () => {
        addWeek(lastWeek, ['spinach', 'broccoli', 'guava', 'amaranth']);
        const {summaryMessages} = withSetup(useWeekSummary);
        const nutrientMessages = summaryMessages.value.filter(({translationKey}) =>
          translationKey.startsWith('weekSummaryDialog.nutrientMessages.'),
        );
        expect(nutrientMessages.length).toBe(11);
        expect(
          summaryMessages.value.find(
            ({translationKey}) => translationKey === 'weekSummaryDialog.nutrientMessages.calcium',
          ),
        ).toBeUndefined();
        expect(
          summaryMessages.value.find(
            ({translationKey}) => translationKey === 'weekSummaryDialog.nutrientMessages.C',
          ),
        ).toBeUndefined();
      });

      it('excludes allergens from nutrient suggestions', () => {
        const appStateStore = useAppStateStore();
        appStateStore.settings.allergens = [
          'almond',
          'champignon',
          'peanut',
          'portobello',
          'shiitake',
        ];
        addWeek(lastWeek, ['apple', 'cucumber']);
        const {summaryMessages} = withSetup(useWeekSummary);
        const b7Message = summaryMessages.value.find(
          ({translationKey}) => translationKey === 'weekSummaryDialog.nutrientMessages.B7',
        );
        expect(b7Message).toBeDefined();
        expect(b7Message!.translationParameters).toEqual(['soybean, sunflower seed']);
      });

      it('returns staples message when a veggie appears in 4+ of the past 5 weeks', () => {
        appStateStore.settings.startDate = thisWeek.subtract({weeks: 5});
        for (let i = 1; i <= 5; i++) {
          addWeek(thisWeek.subtract({weeks: i}), ['apple']);
        }
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(summaryMessages.value).toContainEqual({
          emoji: '🔁',
          translationKey: 'weekSummaryDialog.staples',
          translationParameters: ['apple'],
        });
      });

      it('returns rarities message when a previously-eaten veggie reappears after absence', () => {
        appStateStore.settings.startDate = thisWeek.subtract({weeks: 10});
        activityStore.weeks.unshift({
          startDate: thisWeek.subtract({weeks: 10}),
          veggies: ['apple'],
          challenge: 'cucumber',
        });
        for (let i = 2; i <= 5; i++) {
          addWeek(thisWeek.subtract({weeks: i}), ['carrot']);
        }
        addWeek(lastWeek, ['apple', 'carrot']);
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(summaryMessages.value).toContainEqual({
          emoji: '🦄',
          translationKey: 'weekSummaryDialog.rarities',
          translationParameters: ['apple'],
        });
      });
    });

    describe('integration', () => {
      it('combines multiple message types when conditions are met', () => {
        const thirtyVeggies = take(ALL_VEGGIES, 30);
        appStateStore.settings.startDate = thisWeek.subtract({weeks: 5});
        for (let i = 1; i <= 4; i++) {
          activityStore.weeks.push({
            startDate: thisWeek.subtract({weeks: i}),
            veggies: thirtyVeggies,
            challenge: 'cucumber',
          });
        }
        const {summaryMessages} = withSetup(useWeekSummary);
        expect(summaryMessages.value).toContainEqual(
          expect.objectContaining({
            translationKey: 'weekSummaryDialog.hotStreak',
            translationParameters: [4],
          }),
        );
        expect(
          summaryMessages.value.filter(
            ({translationKey}) => translationKey === 'weekSummaryDialog.missingCategory',
          ).length,
        ).toBeGreaterThan(0);
      });
    });
  });
});
