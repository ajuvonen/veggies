import {computed, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import {computedWithControl} from '@vueuse/core';
import {storeToRefs} from 'pinia';
import {countBy, entries, mean, sample} from 'remeda';
import type {WeeklyAchievements, WeekData, SummaryItem} from '@/types';
import {Category} from '@/types';
import {getCategoryForVeggie, getRandomItem, setIntersection} from '@/utils/helpers';
import {CATEGORY_EMOJI} from '@/utils/constants';
import {NUTRIENTS} from '@/utils/veggieDetails';
import {useAvailableVeggies} from '@/hooks/availableVeggies';
import {useAvailableWeeklyAchievements} from '@/hooks/availableWeeklyAchievements';
import {useActivityStore} from '@/stores/activityStore';

export const useWeekSummary = () => {
  const {t} = useI18n();
  const {availableVeggies} = useAvailableVeggies();
  const {availableWeeklyAchievements} = useAvailableWeeklyAchievements();
  const {
    currentWeekStart,
    veggiesForWeek,
    challengeForWeek,
    hotStreak,
    atMostVeggies,
    weeks,
    allVeggies,
    getWeekStarts,
  } = storeToRefs(useActivityStore());

  const weekData = computedWithControl(currentWeekStart, (): WeekData => {
    const lastWeekStart = currentWeekStart.value.subtract({weeks: 1});
    const veggies = veggiesForWeek.value(lastWeekStart);
    const categoryCounts = countBy(veggies, getCategoryForVeggie);
    const missingCategories = Object.values(Category).filter(
      (category) => !categoryCounts[category],
    );

    const categoryEntries = entries(categoryCounts);
    const favoriteCategory =
      categoryEntries.length > 0
        ? categoryEntries.reduce((max, entry) => (entry[1] > max[1] ? entry : max))[0]
        : null;

    const pastFiveWeeksVeggiesList = Array.from(
      {length: Math.min(5, getWeekStarts.value.length - 1)},
      (_, weekIndex) =>
        veggiesForWeek.value(currentWeekStart.value.subtract({weeks: weekIndex + 1})),
    );
    const pastVeggies = pastFiveWeeksVeggiesList.map((v) => v.length);

    const veggieCounts = countBy(allVeggies.value, (veggie) => veggie);
    const firstTimeVeggies =
      weeks.value.length >= 2 ? veggies.filter((veggie) => veggieCounts[veggie] === 1) : [];

    const pastFiveWeeksTotalCounts = countBy(pastFiveWeeksVeggiesList.flat(), (veggie) => veggie);
    const staples = veggies.filter((veggie) => (pastFiveWeeksTotalCounts[veggie] ?? 0) >= 4);
    const rarities =
      getWeekStarts.value.length - 1 >= 5
        ? veggies.filter(
            (veggie) => pastFiveWeeksTotalCounts[veggie] === 1 && veggieCounts[veggie] > 1,
          )
        : [];

    return {
      atMostVeggies: atMostVeggies.value,
      categoryCounts,
      challenge: challengeForWeek.value(lastWeekStart) || null,
      favoriteCategory,
      firstTimeVeggies,
      firstWeek: weeks.value.length === 1,
      hotStreak: hotStreak.value,
      mean: Math.round((mean(pastVeggies) ?? 0) * 10) / 10,
      missingCategories,
      previousWeekCount: veggiesForWeek.value(currentWeekStart.value.subtract({weeks: 2})).length,
      rarities,
      staples,
      veggies,
      weekNumber: lastWeekStart.weekOfYear!,
    };
  });

  const promotedAchievement = ref<keyof WeeklyAchievements | null>(
    getRandomItem(availableWeeklyAchievements.value) ?? null,
  );

  watch(currentWeekStart, () => {
    promotedAchievement.value = getRandomItem(availableWeeklyAchievements.value) ?? null;
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

    if (data.staples.length > 0) {
      const veggieNames = sample(data.staples, 3)
        .map((veggie) => t(`veggies.${veggie}`).toLowerCase())
        .join(', ');
      messages.push({
        emoji: '🔁',
        translationKey: 'weekSummaryDialog.staples',
        translationParameters: [veggieNames],
      });
    }

    if (data.rarities.length > 0) {
      const veggieNames = sample(data.rarities, 3)
        .map((veggie) => t(`veggies.${veggie}`).toLowerCase())
        .join(', ');
      messages.push({
        emoji: '🦄',
        translationKey: 'weekSummaryDialog.rarities',
        translationParameters: [veggieNames],
      });
    }

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
