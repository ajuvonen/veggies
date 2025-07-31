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
    if (!weekData.value.veggies.length) {
      return [
        {
          emoji: '🍽️',
          translationKey: 'weekStartDialog.noVeggies',
          translationParameters: [],
        },
      ];
    }

    const messages: SummaryItem[] = [];

    // Congratulate if user reached their record amount of veggies
    if (weekData.value.veggies.length === weekData.value.atMostVeggies) {
      messages.push({
        emoji: '📈',
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

    const categoryCounts = countBy(weekData.value.veggies, (veggie) =>
      getCategoryForVeggie(veggie),
    );

    // Add message for favorite category if there are veggies
    if (Object.keys(categoryCounts).length > 0) {
      const [favoriteCategory, favoriteCount] = Object.entries(categoryCounts).reduce(
        (max, [category, count]) => (count > max[1] ? [category, count] : max),
      ) as [Category, number];

      messages.push({
        emoji: '⭐',
        translationKey: 'weekStartDialog.favoriteCategory',
        translationParameters: [t(`categories.${favoriteCategory}`).toLowerCase(), favoriteCount],
      });
    }

    Object.values(Category)
      .filter((category) => !categoryCounts[category])
      .forEach((category) => {
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
