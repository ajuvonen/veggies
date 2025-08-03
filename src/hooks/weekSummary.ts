import {computed, type ComputedRef} from 'vue';
import {useI18n} from 'vue-i18n';
import {countBy} from 'remeda';
import type {WeekData, SummaryItem} from '@/utils/types';
import {Category} from '@/utils/types';
import {getCategoryForVeggie} from '@/utils/helpers';
import {CATEGORY_EMOJI} from '@/utils/constants';

export const useWeekSummary = (weekData: ComputedRef<WeekData>) => {
  const {t} = useI18n();

  const createProgressMessages = (data: WeekData): SummaryItem[] => {
    const messages: SummaryItem[] = [];
    const veggieCount = data.veggies.length;

    if (veggieCount < 15) {
      messages.push({
        emoji: '🌱',
        translationKey: 'weekStartDialog.goodStart',
        translationParameters: [veggieCount],
      });
    } else if (veggieCount < 30) {
      messages.push({
        emoji: '🥗',
        translationKey: 'weekStartDialog.makingProgress',
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
        translationKey: 'weekStartDialog.surpassedPreviousWeek',
        translationParameters: [data.previousWeekCount],
      });
    } else if (data.previousWeekCount - data.veggies.length > 3) {
      messages.push({
        emoji: '📉',
        translationKey: 'weekStartDialog.fellShort',
        translationParameters: [data.previousWeekCount],
      });
    }

    return messages;
  };

  const createStatisticsMessages = (data: WeekData): SummaryItem[] => {
    const messages: SummaryItem[] = [];

    messages.push({
      emoji: '📊',
      translationKey: 'weekStartDialog.mean',
      translationParameters: [data.mean],
    });

    if (data.veggies.length === data.atMostVeggies) {
      messages.push({
        emoji: '👑',
        translationKey: 'weekStartDialog.recordAchieved',
        translationParameters: [data.atMostVeggies],
      });
    }

    if (data.hotStreak >= 2) {
      messages.push({
        emoji: '🔥',
        translationKey: 'weekStartDialog.hotStreak',
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
          ? 'weekStartDialog.challengeCompleted'
          : 'weekStartDialog.challengeMissed',
        translationParameters: [t(`veggies.${data.challenge}`).toLowerCase()],
      });
    }

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
        translationKey: 'weekStartDialog.favoriteCategory',
        translationParameters: [t(`categories.${favoriteCategory}`).toLowerCase(), favoriteCount],
      });
    }

    // All categories achievement
    const missingCategories = Object.values(Category).filter(
      (category) => !categoryCounts[category],
    );

    if (missingCategories.length === 0) {
      messages.push({
        emoji: '🌈',
        translationKey: 'weekStartDialog.allCategories',
        translationParameters: [],
      });
    }

    // Low category counts
    Object.entries(categoryCounts).forEach(([category, count]) => {
      if (count < 4) {
        messages.push({
          emoji: '🤔',
          translationKey: 'weekStartDialog.lowCategoryCount',
          translationParameters: [count, t(`categories.${category}`).toLowerCase()],
        });
      }
    });

    // Missing categories
    missingCategories.forEach((category) => {
      messages.push({
        emoji: CATEGORY_EMOJI[category],
        translationKey: 'weekStartDialog.missingCategory',
        translationParameters: [t(`categories.${category}`).toLowerCase()],
      });
    });

    return messages;
  };

  const summaryMessages = computed<SummaryItem[]>(() => {
    if (!weekData.value.veggies.length) {
      return [
        {
          emoji: '🍽️',
          translationKey: 'weekStartDialog.noVeggies',
          translationParameters: [],
        },
      ];
    }

    return [
      ...createProgressMessages(weekData.value),
      ...createComparisonMessages(weekData.value),
      ...createStatisticsMessages(weekData.value),
      ...createChallengeMessages(weekData.value),
      ...createCategoryMessages(weekData.value),
    ];
  });

  return {
    summaryMessages,
  };
};
