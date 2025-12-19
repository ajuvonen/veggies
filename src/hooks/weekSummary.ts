import {computed, toValue, type MaybeRefOrGetter} from 'vue';
import {useI18n} from 'vue-i18n';
import {countBy, intersection, sample} from 'remeda';
import type {WeekData, SummaryItem} from '@/types';
import {Category} from '@/types';
import {getCategoryForVeggie} from '@/utils/helpers';
import {CATEGORY_EMOJI} from '@/utils/constants';
import {NUTRIENTS} from '@/utils/veggieDetails';
import {useAvailableVeggies} from '@/hooks/availableVeggies';

export const useWeekSummary = (weekData: MaybeRefOrGetter<WeekData | null>) => {
  const {t} = useI18n();

  const {availableVeggies} = useAvailableVeggies();

  const createNutrientMessages = (data: WeekData): SummaryItem[] => {
    const messages: SummaryItem[] = [];

    Object.entries(NUTRIENTS).forEach(([nutrient, nutrientVeggies]) => {
      const foundVeggies = nutrientVeggies.filter((veggie) => data.veggies.includes(veggie));
      if (foundVeggies.length < 2) {
        const suggestions = sample(intersection(availableVeggies.value, nutrientVeggies), 3)
          .map((veggie) => t(`veggies.${veggie}`).toLowerCase())
          .join(', ');
        messages.push({
          emoji: '💊',
          translationKey: `weekSummaryDialog.nutrientMessages.${nutrient}`,
          translationParameters: [suggestions],
        });
      }
    });

    return messages;
  };

  const createProgressMessages = (data: WeekData): SummaryItem[] => {
    const messages: SummaryItem[] = [];
    const veggieCount = data.veggies.length;

    if (veggieCount < 10) {
      messages.push({
        emoji: '🍂',
        translationKey: 'weekSummaryDialog.roomForImprovement',
        translationParameters: [veggieCount],
      });
    } else if (veggieCount < 20) {
      messages.push({
        emoji: '🌱',
        translationKey: 'weekSummaryDialog.goodStart',
        translationParameters: [veggieCount],
      });
    } else if (veggieCount < 30) {
      messages.push({
        emoji: '🥗',
        translationKey: 'weekSummaryDialog.makingProgress',
        translationParameters: [veggieCount],
      });
    } else if (veggieCount >= 30 && data.hotStreak === 1) {
      messages.push({
        emoji: '🎉',
        translationKey: 'weekSummaryDialog.accomplishment',
        translationParameters: [veggieCount],
      });
    }

    return messages;
  };

  const createComparisonMessages = (data: WeekData): SummaryItem[] => {
    const messages: SummaryItem[] = [];

    if (!data.firstWeek && data.previousWeekCount < data.veggies.length) {
      messages.push({
        emoji: '📈',
        translationKey: 'weekSummaryDialog.surpassedPreviousWeek',
        translationParameters: [data.previousWeekCount],
      });
    } else if (data.previousWeekCount - data.veggies.length > 3) {
      messages.push({
        emoji: '📉',
        translationKey: 'weekSummaryDialog.fellShort',
        translationParameters: [data.previousWeekCount],
      });
    }

    return messages;
  };

  const createStatisticsMessages = (data: WeekData): SummaryItem[] => {
    const messages: SummaryItem[] = [];

    messages.push({
      emoji: '📊',
      translationKey: 'weekSummaryDialog.mean',
      translationParameters: [data.mean],
    });

    if (data.veggies.length === data.atMostVeggies) {
      messages.push({
        emoji: '🥇',
        translationKey: 'weekSummaryDialog.recordAchieved',
        translationParameters: [data.atMostVeggies],
      });
    } else if (data.atMostVeggies - data.veggies.length < 3) {
      messages.push({
        emoji: '🥈',
        translationKey: 'weekSummaryDialog.closeToRecord',
        translationParameters: [data.atMostVeggies - data.veggies.length, data.atMostVeggies],
      });
    }

    if (data.hotStreak >= 2) {
      messages.push({
        emoji: '🔥',
        translationKey: 'weekSummaryDialog.hotStreak',
        translationParameters: [data.hotStreak],
      });
    }

    return messages;
  };

  const createChallengeMessages = (data: WeekData): SummaryItem[] => {
    const messages: SummaryItem[] = [];

    if (data.challenge) {
      const challengeCompleted = data.veggies.includes(data.challenge);
      messages.push({
        emoji: challengeCompleted ? '🎖️' : '😶‍🌫️',
        translationKey: challengeCompleted
          ? 'weekSummaryDialog.challengeCompleted'
          : 'weekSummaryDialog.challengeMissed',
        translationParameters: [t(`veggies.${data.challenge}`).toLowerCase()],
      });
    }

    // Create individual message for each first-time veggie
    data.firstTimeVeggies.forEach((veggie) => {
      messages.push({
        emoji: '🆕',
        translationKey: 'weekSummaryDialog.firstTimeVeggie',
        translationParameters: [t(`veggies.${veggie}`).toLowerCase()],
      });
    });

    return messages;
  };

  const createCategoryMessages = (data: WeekData): SummaryItem[] => {
    const messages: SummaryItem[] = [];
    const categoryCounts = countBy(data.veggies, getCategoryForVeggie);

    // Favorite category
    const [favoriteCategory, favoriteCount] = Object.entries(categoryCounts).reduce(
      (max, [category, count]) => (count > max[1] ? [category, count] : max),
    ) as [Category, number];

    if (favoriteCount >= 4) {
      messages.push({
        emoji: '⭐',
        translationKey: 'weekSummaryDialog.favoriteCategory',
        translationParameters: [favoriteCount, t(`categories.${favoriteCategory}`).toLowerCase()],
      });
    }

    // All categories achievement
    const missingCategories = Object.values(Category).filter(
      (category) => !categoryCounts[category],
    );

    if (missingCategories.length === 0) {
      messages.push({
        emoji: '🤹',
        translationKey: 'weekSummaryDialog.allCategories',
        translationParameters: [],
      });
    }

    // Low category counts
    Object.entries(categoryCounts).forEach(([category, count]) => {
      if (count < 3) {
        messages.push({
          emoji: '🤔',
          translationKey: 'weekSummaryDialog.lowCategoryCount',
          translationParameters: [count, t(`categories.${category}`).toLowerCase()],
        });
      }
    });

    // Missing categories
    missingCategories.forEach((category) => {
      messages.push({
        emoji: CATEGORY_EMOJI[category],
        translationKey: 'weekSummaryDialog.missingCategory',
        translationParameters: [t(`categories.${category}`).toLowerCase()],
      });
    });

    return messages;
  };

  const summaryMessages = computed<SummaryItem[]>(() => {
    const valueForData = toValue(weekData);
    if (!valueForData) {
      return [];
    } else if (!valueForData.veggies.length) {
      return [
        {
          emoji: '🍽️',
          translationKey: 'weekSummaryDialog.noVeggies',
          translationParameters: [],
        },
      ];
    }

    return [
      ...createProgressMessages(valueForData),
      ...createComparisonMessages(valueForData),
      ...createStatisticsMessages(valueForData),
      ...createChallengeMessages(valueForData),
      ...createCategoryMessages(valueForData),
      ...createNutrientMessages(valueForData),
    ];
  });

  return {
    summaryMessages,
  };
};
