import {computed, ref} from 'vue';
import {defineStore, storeToRefs} from 'pinia';
import {debounceFilter, useIntervalFn, useNow, useStorage} from '@vueuse/core';
import {DateTime} from 'luxon';
import {
  countBy,
  difference,
  entries,
  intersection,
  map,
  pipe,
  prop,
  sortBy,
  take,
  takeWhile,
} from 'remeda';
import {
  Category,
  type Favorites,
  type Challenge,
  type Week,
  type Achievements,
  AchievementLevel,
} from '@/utils/types';
import {
  achievementLevelHelper,
  dateParser,
  dateReplacer,
  getCategoryForVeggie,
  getRandomVeggie,
} from '@/utils/helpers';
import {useAppStateStore} from '@/stores/appStateStore';
import {
  BEANS,
  BOTANICAL_BERRIES,
  FRUITS,
  GRAINS,
  LEAFIES,
  MUSHROOMS,
  NUTS,
  RED_VEGGIES,
  ROOTS,
  VEGETABLES,
} from '@/utils/constants';

export const useActivityStore = defineStore('activity', () => {
  const {settings} = storeToRefs(useAppStateStore());
  const currentDate = ref(DateTime.now());
  useIntervalFn(() => {
    const now = DateTime.now();
    if (!currentDate.value.hasSame(now, 'day')) {
      currentDate.value = now;
    }
  }, 2000);

  // State refs
  const startDate = useStorage<DateTime | null>('veggies-start-date', null, localStorage, {
    mergeDefaults: true,
    serializer: {
      read: (v) => (v ? DateTime.fromISO(v.split('T')[0]) : null),
      write: (v) => v?.toISODate() ?? '',
    },
  });

  const weeks = useStorage<Week[]>('veggies-weeks', [], localStorage, {
    mergeDefaults: true,
    eventFilter: debounceFilter(2000),
    serializer: {
      read: (v) => (v ? JSON.parse(v, dateParser) : null),
      write: (v) => JSON.stringify(v, dateReplacer),
    },
  });

  const challenges = useStorage<Challenge[]>('veggies-challenges', [], localStorage, {
    mergeDefaults: true,
    serializer: {
      read: (v) => (v ? JSON.parse(v, dateParser) : null),
      write: (v) => JSON.stringify(v, dateReplacer),
    },
  });

  // Computed getters
  const currentWeekStart = computed(() => currentDate.value.startOf('week'));

  const getWeekStarts = computed(() => {
    if (!startDate.value) return [currentWeekStart.value];
    const totalWeeks = Math.ceil(currentDate.value.diff(startDate.value, 'week').weeks);
    return Array.from({length: totalWeeks}, (_, weekIndex) =>
      currentWeekStart.value.minus({weeks: weekIndex}),
    );
  });

  const hotStreak = computed(() => {
    let over30Weeks = takeWhile(
      getWeekStarts.value,
      (weekStart, weekIndex) => weekIndex === 0 || veggiesForWeek.value(weekStart).length >= 30,
    ).length;
    if (currentVeggies.value.length < 30) {
      over30Weeks--;
    }
    return over30Weeks;
  });

  const allVeggies = computed(() => weeks.value.flatMap(prop('veggies')));

  const uniqueVeggies = computed(() => [...new Set(allVeggies.value)]);

  const over30Veggies = computed(
    () => weeks.value.filter(({veggies}) => veggies.length >= 30).length,
  );

  const atMostVeggies = computed(() =>
    Math.max(...weeks.value.map(({veggies}) => veggies.length), 0),
  );

  const completedChallenges = computed(
    () =>
      challenges.value.filter(({startDate, veggie}) =>
        veggiesForWeek.value(startDate).includes(veggie),
      ).length,
  );

  const veggiesForWeek = computed(
    () => (weekStart: DateTime) =>
      weeks.value.find(({startDate}) => startDate.equals(weekStart))?.veggies ?? [],
  );

  const currentVeggies = computed({
    get: () => veggiesForWeek.value(currentWeekStart.value),
    set: (veggies: string[]) => setVeggiesForWeek(veggies),
  });

  const currentChallenge = computed(
    () => challenges.value.find(({startDate}) => startDate.equals(currentWeekStart.value))?.veggie,
  );

  const suggestions = computed(() =>
    pipe(
      allVeggies.value.filter((veggie) => !currentVeggies.value.includes(veggie)),
      countBy((veggie) => veggie),
      entries(),
      sortBy([prop(1), 'desc']),
      take(settings.value.suggestionCount),
      map(prop(0)),
    ),
  );

  const favorites = computed(() =>
    Object.values(Category).reduce(
      (acc, category) => ({
        ...acc,
        [category]: pipe(
          allVeggies.value.filter((veggie) => getCategoryForVeggie(veggie) === category),
          countBy((veggie) => veggie),
          entries(),
          sortBy([prop(1), 'desc']),
          take(6),
        ),
      }),
      {} as Favorites,
    ),
  );

  const weeklyAchievements = computed(() => (veggies: string[] = currentVeggies.value) => ({
    allOnRed: achievementLevelHelper(
      [[10, AchievementLevel.Gold]],
      intersection(RED_VEGGIES, veggies).length,
    ),
    botanicalBerries: achievementLevelHelper(
      [[15, AchievementLevel.Gold]],
      intersection(BOTANICAL_BERRIES, veggies).length,
    ),
    goNuts: achievementLevelHelper(
      [[5, AchievementLevel.Gold]],
      intersection(NUTS, veggies).length,
    ),
    thirtyVeggies: achievementLevelHelper(
      [
        [40, AchievementLevel.Platinum],
        [30, AchievementLevel.Gold],
      ],
      veggies.length,
    ),
  }));

  const achievements = computed<Achievements>(() => ({
    challengeAccepted: achievementLevelHelper(
      [
        [20, AchievementLevel.Gold],
        [10, AchievementLevel.Silver],
        [5, AchievementLevel.Bronze],
      ],
      completedChallenges.value,
    ),
    committed: achievementLevelHelper(
      [
        [52, AchievementLevel.Gold],
        [26, AchievementLevel.Silver],
        [12, AchievementLevel.Bronze],
      ],
      weeks.value.length,
    ),
    completionist: achievementLevelHelper(
      [
        [150, AchievementLevel.Gold],
        [80, AchievementLevel.Silver],
        [40, AchievementLevel.Bronze],
      ],
      uniqueVeggies.value.length,
    ),
    experimenterBean: achievementLevelHelper(
      [[15, AchievementLevel.Gold]],
      intersection(BEANS, uniqueVeggies.value).length,
    ),
    experimenterFruit: achievementLevelHelper(
      [[15, AchievementLevel.Gold]],
      intersection(FRUITS, uniqueVeggies.value).length,
    ),
    experimenterGrain: achievementLevelHelper(
      [[15, AchievementLevel.Gold]],
      intersection(GRAINS, uniqueVeggies.value).length,
    ),
    experimenterLeafy: achievementLevelHelper(
      [[15, AchievementLevel.Gold]],
      intersection(LEAFIES, uniqueVeggies.value).length,
    ),
    experimenterMushroom: achievementLevelHelper(
      [[15, AchievementLevel.Gold]],
      intersection(MUSHROOMS, uniqueVeggies.value).length,
    ),
    experimenterRoot: achievementLevelHelper(
      [[15, AchievementLevel.Gold]],
      intersection(ROOTS, uniqueVeggies.value).length,
    ),
    experimenterVegetable: achievementLevelHelper(
      [[15, AchievementLevel.Gold]],
      intersection(VEGETABLES, uniqueVeggies.value).length,
    ),
    hotStreak: achievementLevelHelper(
      [
        [20, AchievementLevel.Gold],
        [10, AchievementLevel.Silver],
        [5, AchievementLevel.Bronze],
      ],
      hotStreak.value,
    ),
    thousandsEven:
      allVeggies.value.length >= 1000 && Math.floor(allVeggies.value.length / 1000) % 2 === 0
        ? AchievementLevel.Platinum
        : AchievementLevel.NoAchievement,
    thousandsOdd:
      allVeggies.value.length >= 1000 && Math.floor(allVeggies.value.length / 1000) % 2 === 1
        ? AchievementLevel.Platinum
        : AchievementLevel.NoAchievement,
    ...weeklyAchievements.value(),
  }));

  // Actions
  const toggleVeggie = (targetVeggie: string) =>
    toggleVeggieForWeek(targetVeggie, currentWeekStart.value);

  const toggleVeggieForWeek = (targetVeggie: string, weekStart: DateTime) => {
    const targetWeek = weeks.value.find(({startDate}) => startDate.equals(weekStart));
    if (!targetWeek) {
      weeks.value = [
        ...weeks.value,
        {
          startDate: weekStart,
          veggies: [targetVeggie],
        },
      ];
      challenges.value = [
        ...challenges.value,
        {
          startDate: weekStart,
          veggie: getRandomVeggie(),
        },
      ];
    } else if (!targetWeek.veggies.includes(targetVeggie)) {
      targetWeek.veggies = [...targetWeek.veggies, targetVeggie];
    } else {
      targetWeek.veggies = difference(targetWeek.veggies, [targetVeggie]);
    }
  };

  const setVeggiesForWeek = (veggies: string[], weekStart: DateTime = currentWeekStart.value) => {
    const targetWeek = weeks.value.find(({startDate}) => startDate.equals(weekStart));
    if (!targetWeek) {
      weeks.value = [
        ...weeks.value,
        {
          startDate: weekStart,
          veggies,
        },
      ];
      challenges.value = [
        ...challenges.value,
        {
          startDate: weekStart,
          veggie: getRandomVeggie(),
        },
      ];
    } else {
      targetWeek.veggies = veggies;
    }
  };

  const $reset = () => {
    startDate.value = null;
    weeks.value = [];
    challenges.value = [];
  };

  return {
    achievements,
    allVeggies,
    atMostVeggies,
    challenges,
    completedChallenges,
    currentChallenge,
    currentVeggies,
    favorites,
    getWeekStarts,
    hotStreak,
    over30Veggies,
    startDate,
    suggestions,
    uniqueVeggies,
    veggiesForWeek,
    weeklyAchievements,
    weeks,
    setVeggiesForWeek,
    toggleVeggie,
    toggleVeggieForWeek,
    $reset,
  };
});
