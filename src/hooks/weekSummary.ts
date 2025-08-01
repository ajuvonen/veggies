import {computed, type ComputedRef} from 'vue';
import {useI18n} from 'vue-i18n';
import {countBy} from 'remeda';
import type {WeekData, SummaryItem} from '@/utils/types';
import {Category} from '@/utils/types';
import {getCategoryForVeggie} from '@/utils/helpers';
import {CATEGORY_EMOJI} from '@/utils/constants';

export const useWeekSummary = (weekData: ComputedRef<WeekData>) => {
  const {t} = useI18n();

  // All possible messages based on the week data
  const summaryMessages = computed<SummaryItem[]>(() => {
    const messages: SummaryItem[] = [];
    if (!weekData.value.veggies.length) {
      return [
        {
          emoji: '🍽️',
          translationKey: 'weekStartDialog.noVeggies',
          translationParameters: [],
        },
      ];
    } else if (weekData.value.veggies.length < 15) {
      messages.push({
        emoji: '🌱',
        translationKey: 'weekStartDialog.goodStart',
        translationParameters: [weekData.value.veggies.length],
      });
    } else if (weekData.value.veggies.length < 30) {
      messages.push({
        emoji: '🥗',
        translationKey: 'weekStartDialog.makingProgress',
        translationParameters: [weekData.value.veggies.length],
      });
    }

    messages.push({
      emoji: '📊',
      translationKey: 'weekStartDialog.mean',
      translationParameters: [weekData.value.mean],
    });

    // Congratulate if user reached their record amount of veggies
    if (weekData.value.veggies.length === weekData.value.atMostVeggies) {
      messages.push({
        emoji: '👑',
        translationKey: 'weekStartDialog.recordAchieved',
        translationParameters: [weekData.value.atMostVeggies],
      });
    }

    // Congratulate on hot streak if it's at least 2 weeks
    if (weekData.value.hotStreak >= 2) {
      messages.push({
        emoji: '🔥',
        translationKey: 'weekStartDialog.hotStreak',
        translationParameters: [weekData.value.hotStreak],
      });
    }

    if (weekData.value.challenge) {
      if (weekData.value.veggies.includes(weekData.value.challenge)) {
        messages.push({
          emoji: '🎖️',
          translationKey: 'weekStartDialog.challengeCompleted',
          translationParameters: [t(`veggies.${weekData.value.challenge}`).toLowerCase()],
        });
      } else {
        messages.push({
          emoji: '😶‍🌫️',
          translationKey: 'weekStartDialog.challengeMissed',
          translationParameters: [t(`veggies.${weekData.value.challenge}`).toLowerCase()],
        });
      }
    }

    const categoryCounts = countBy(weekData.value.veggies, (veggie) =>
      getCategoryForVeggie(veggie),
    );

    // Add message for favorite category if there are veggies
    const [favoriteCategory, favoriteCount] = Object.entries(categoryCounts).reduce(
      (max, [category, count]) => (count > max[1] ? [category, count] : max),
    ) as [Category, number];

    messages.push({
      emoji: '⭐',
      translationKey: 'weekStartDialog.favoriteCategory',
      translationParameters: [t(`categories.${favoriteCategory}`).toLowerCase(), favoriteCount],
    });

    const missingCategories = Object.values(Category).filter(
      (category) => !categoryCounts[category],
    );

    if (!missingCategories.length) {
      messages.push({
        emoji: '🌈',
        translationKey: 'weekStartDialog.allCategories',
        translationParameters: [],
      });
    }

    missingCategories.forEach((category) => {
      messages.push({
        emoji: CATEGORY_EMOJI[category],
        translationKey: 'weekStartDialog.missingCategory',
        translationParameters: [t(`categories.${category}`).toLowerCase()],
      });
    });

    return messages;
  });

  return {
    summaryMessages,
  };
};
