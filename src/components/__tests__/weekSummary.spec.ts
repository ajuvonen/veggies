import {describe, it, expect} from 'vitest';
import {ref, computed} from 'vue';
import {useWeekSummary} from '@/hooks/weekSummary';
import type {WeekData} from '@/utils/types';

describe('useWeekSummary', () => {
  it('returns no veggies message when veggies array is empty', () => {
    const weekData = computed(() => ({
      atMostVeggies: 25,
      challenge: 'apple',
      hotStreak: 5,
      veggies: [],
      weekNumber: '30',
    }));

    const {summaryMessages} = useWeekSummary(weekData);

    expect(summaryMessages.value).toEqual([
      {
        emoji: '🍽️',
        translationKey: 'weekStartDialog.noVeggies',
        translationParameters: [],
      },
    ]);
  });

  it('returns empty array when veggies are present (until more logic is added)', () => {
    const weekData = computed(() => ({
      atMostVeggies: 25,
      challenge: 'apple',
      hotStreak: 5,
      veggies: ['apple', 'banana', 'carrot'],
      weekNumber: '30',
    }));

    const {summaryMessages} = useWeekSummary(weekData);

    expect(summaryMessages.value).toEqual([]);
  });

  it('reactively updates when week data changes', () => {
    const weekData = ref<WeekData>({
      atMostVeggies: 25,
      challenge: 'apple',
      hotStreak: 5,
      veggies: ['apple'],
      weekNumber: '30',
    });
    const weekDataComputed = computed(() => weekData.value);
    const {summaryMessages} = useWeekSummary(weekDataComputed);

    expect(summaryMessages.value).toEqual([]);

    weekData.value = {
      atMostVeggies: 25,
      challenge: 'banana',
      hotStreak: 6,
      veggies: [],
      weekNumber: '31',
    };
    expect(summaryMessages.value).toEqual([
      {
        emoji: '🍽️',
        translationKey: 'weekStartDialog.noVeggies',
        translationParameters: [],
      },
    ]);
  });
});
