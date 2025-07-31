import {computed, type ComputedRef} from 'vue';
import type {WeekData, SummaryItem} from '@/utils/types';

export const useWeekSummary = (weekData: ComputedRef<WeekData>) => {
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

    // For now, return empty array when there are veggies
    // This is where we'll add more message logic later
    return [];
  });

  return {
    summaryMessages,
  };
};
