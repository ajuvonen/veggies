import {computed, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import {computedWithControl} from '@vueuse/core';
import {storeToRefs} from 'pinia';
import {countBy, mean, sample} from 'remeda';
import type {Achievements, WeekData, SummaryItem} from '@/types';
import {Category} from '@/types';
import {getCategoryForVeggie, getRandomItem, setIntersection} from '@/utils/helpers';
import {CATEGORY_EMOJI} from '@/utils/constants';
import {NUTRIENTS} from '@/utils/veggieDetails';
import {useAvailableVeggies} from '@/hooks/availableVeggies';
import {useActivityStore} from '@/stores/activityStore';

const weeklyAchievements: (keyof Achievements)[] = [
  'allOnRed',
  'botanicalBerries',
  'goNuts',
  'lemons',
  'overachiever',
  'rainbow',
  'tearnado',
];

export const useWeekSummary = () => {
  const {t} = useI18n();
  const {availableVeggies} = useAvailableVeggies();
  const {
    currentWeekStart,
    veggiesForWeek,
    challengeForWeek,
    hotStreak,
    atMostVeggies,
    weeks,
    allVeggies,
  } = storeToRefs(useActivityStore());

  const weekData = computedWithControl(currentWeekStart, (): WeekData => {
    const lastWeekStart = currentWeekStart.value.subtract({weeks: 1});
    const veggies = veggiesForWeek.value(lastWeekStart);
    const categoryCounts = countBy(veggies, getCategoryForVeggie);
    const missingCategories = Object.values(Category).filter(
      (category) => !categoryCounts[category],
    );

    const categoryEntries = Object.entries(categoryCounts) as [Category, number][];
    const favoriteCategory =
      categoryEntries.length > 0
        ? categoryEntries.reduce((max, entry) => (entry[1] > max[1] ? entry : max))[0]
        : null;

    const pastVeggies = Array.from(
      {length: Math.min(5, weeks.value.length)},
      (_, weekIndex) =>
        veggiesForWeek.value(currentWeekStart.value.subtract({weeks: weekIndex + 1})).length,
    );

    const veggieCounts = countBy(allVeggies.value, (veggie) => veggie);
    const firstTimeVeggies =
      weeks.value.length >= 2 ? veggies.filter((veggie) => veggieCounts[veggie] === 1) : [];

    return {
      atMostVeggies: atMostVeggies.value,
      categoryCounts,
      challenge: challengeForWeek.value(lastWeekStart) || null,
      favoriteCategory,
      firstTimeVeggies,
      firstWeek: weeks.value.length === 1,
      hotStreak: hotStreak.value,
      mean: Math.round(mean(pastVeggies) ?? 0),
      missingCategories,
      previousWeekCount: veggiesForWeek.value(currentWeekStart.value.subtract({weeks: 2})).length,
      veggies,
      weekNumber: lastWeekStart.weekOfYear!,
    };
  });

  const promotedAchievement = ref<keyof Achievements>(getRandomItem(weeklyAchievements)!);

  watch(currentWeekStart, () => {
    promotedAchievement.value = getRandomItem(weeklyAchievements)!;
  });

  const createNutrientMessages = (data: WeekData): SummaryItem[] => {
    const messages: SummaryItem[] = [];

    Object.entries(NUTRIENTS).forEach(([nutrient, nutrientVeggies]) => {
      const foundVeggies = setIntersection(nutrientVeggies, data.veggies);
      if (foundVeggies.length < 2) {
        const suggestions = sample(setIntersection(nutrientVeggies, availableVeggies.value), 3)
          .map((veggie) => t(`veggies.${veggie}`).toLowerCase())
          .join(', ');
        messages.push({
          emoji: '🧑‍⚕️',
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

    if (data.favoriteCategory !== null) {
      const favoriteCount = data.categoryCounts[data.favoriteCategory] ?? 0;
      if (favoriteCount >= 4) {
        messages.push({
          emoji: '⭐',
          translationKey: 'weekSummaryDialog.favoriteCategory',
          translationParameters: [
            favoriteCount,
            t(`categories.${data.favoriteCategory}`).toLowerCase(),
          ],
        });
      }
    }

    if (data.missingCategories.length === 0) {
      messages.push({
        emoji: '🤹',
        translationKey: 'weekSummaryDialog.allCategories',
        translationParameters: [],
      });
    }

    Object.entries(data.categoryCounts).forEach(([category, count]) => {
      if (count < 3) {
        messages.push({
          emoji: '🤔',
          translationKey: 'weekSummaryDialog.lowCategoryCount',
          translationParameters: [count, t(`categories.${category}`).toLowerCase()],
        });
      }
    });

    data.missingCategories.forEach((category) => {
      messages.push({
        emoji: CATEGORY_EMOJI[category],
        translationKey: 'weekSummaryDialog.missingCategory',
        translationParameters: [t(`categories.${category}`).toLowerCase()],
      });
    });

    return messages;
  };

  const summaryMessages = computed<SummaryItem[]>(() => {
    const data = weekData.value;
    if (!data.veggies.length) {
      return [
        {
          emoji: '🍽️',
          translationKey: 'weekSummaryDialog.noVeggies',
          translationParameters: [],
        },
      ];
    }

    return [
      ...createProgressMessages(data),
      ...createComparisonMessages(data),
      ...createStatisticsMessages(data),
      ...createChallengeMessages(data),
      ...createCategoryMessages(data),
      ...createNutrientMessages(data),
    ];
  });

  return {
    weekData,
    summaryMessages,
    promotedAchievement,
  };
};
