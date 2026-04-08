import {computed, ref} from 'vue';
import {defineStore, storeToRefs} from 'pinia';
import {debounceFilter, useIntervalFn, useLocalStorage} from '@vueuse/core';
import {
  countBy,
  difference,
  entries,
  fromKeys,
  map,
  pipe,
  prop,
  sortBy,
  take,
  takeWhile,
} from 'remeda';
import {Category, type Favorites, type Week, type Achievements, AchievementLevel} from '@/types';
import {
  achievementLevelHelper,
  areDatesEqual,
  dateParser,
  getCategoryForVeggie,
  getRandomItem,
  getWeekStart,
  setIntersection,
} from '@/utils/helpers';
import {useAppStateStore} from '@/stores/appStateStore';
import {
  BEANS,
  BOTANICAL_BERRIES,
  CITRUSES,
  FRUITS,
  GRAINS,
  LEAFIES,
  MUSHROOMS,
  NUTS,
  ONIONS,
  RED_VEGGIES,
  ROOTS,
  VEGETABLES,
} from '@/utils/veggieDetails';
import {useAvailableVeggies} from '@/hooks/availableVeggies';

export const useActivityStore = defineStore('activity', () => {
  const {settings} = storeToRefs(useAppStateStore());
  const {availableVeggies} = useAvailableVeggies();
  const currentDate = ref(Temporal.Now.plainDateISO());
  useIntervalFn(() => {
    const now = Temporal.Now.plainDateISO();
    if (!areDatesEqual(currentDate.value, now)) {
      currentDate.value = now;
    }
  }, 2000);

  // State refs
  const weeks = useLocalStorage<Week[]>('veggies-weeks', [], {
    mergeDefaults: true,
    eventFilter: debounceFilter(2000),
    serializer: {
      read: (v) => (v ? JSON.parse(v, dateParser) : null),
      write: (v) => JSON.stringify(v),
    },
  });

  const weeksMap = computed(
    () => new Map(weeks.value.map((week) => [week.startDate.toString(), week])),
  );

  // Computed getters
  const currentWeekStart = computed(() => getWeekStart(currentDate.value));

  const getWeekStarts = computed(() => {
    if (!settings.value.startDate) return [currentWeekStart.value];
    const totalWeeks =
      settings.value.startDate.until(currentWeekStart.value, {largestUnit: 'weeks'}).weeks + 1;
    return Array.from({length: totalWeeks}, (_, weekIndex) =>
      currentWeekStart.value.subtract({weeks: weekIndex}),
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
    () => weeks.value.filter(({challenge, veggies}) => veggies.includes(challenge)).length,
  );

  const veggiesForWeek = computed(
    () => (weekStart: Temporal.PlainDate) =>
      weeksMap.value.get(weekStart.toString())?.veggies ?? [],
  );

  const challengeForWeek = computed(
    () => (weekStart: Temporal.PlainDate) => weeksMap.value.get(weekStart.toString())?.challenge,
  );

  const currentVeggies = computed({
    get: () => veggiesForWeek.value(currentWeekStart.value),
    set: (veggies: string[]) => setVeggiesForWeek(veggies),
  });

  const currentChallenge = computed(
    () => weeksMap.value.get(currentWeekStart.value.toString())?.challenge,
  );

  const suggestions = computed(() => {
    const currentVeggiesSet = new Set(currentVeggies.value);
    return pipe(
      allVeggies.value.filter((veggie) => !currentVeggiesSet.has(veggie)),
      countBy((veggie) => veggie),
      entries(),
      sortBy([prop(1), 'desc']),
      take(settings.value.suggestionCount),
      map(prop(0)),
    );
  });

  const veggiesByCategory = computed(() =>
    allVeggies.value.reduce(
      (acc, veggie) => {
        const category = getCategoryForVeggie(veggie);
        if (category) {
          acc[category].push(veggie);
        }
        return acc;
      },
      fromKeys(Object.values(Category), () => []) as Record<Category, string[]>,
    ),
  );

  const favorites = computed(
    () =>
      fromKeys(Object.values(Category), (category) =>
        pipe(
          veggiesByCategory.value[category],
          countBy((veggie) => veggie),
          entries(),
          sortBy([prop(1), 'desc']),
          take(6),
        ),
      ) as Favorites,
  );

  const weeklyAchievements = computed(
    () =>
      (
        veggies: string[] = currentVeggies.value,
        weekStart: Temporal.PlainDate = currentWeekStart.value,
      ) => {
        const groupedVeggies = countBy(veggies, getCategoryForVeggie);
        const challenge = challengeForWeek.value(weekStart);
        const challengeCompleted = challenge && veggies.includes(challenge);

        return {
          allOnRed: achievementLevelHelper(
            [[10, AchievementLevel.Gold]],
            setIntersection(RED_VEGGIES, veggies).length,
          ),
          botanicalBerries: achievementLevelHelper(
            [[15, AchievementLevel.Gold]],
            setIntersection(BOTANICAL_BERRIES, veggies).length,
          ),
          goNuts: achievementLevelHelper(
            [[5, AchievementLevel.Gold]],
            setIntersection(NUTS, veggies).length,
          ),
          lemons: achievementLevelHelper(
            [[5, AchievementLevel.Gold]],
            setIntersection(CITRUSES, veggies).length,
          ),
          overachiever:
            veggies.length >= 30 && challengeCompleted
              ? AchievementLevel.Gold
              : AchievementLevel.NoAchievement,
          rainbow: Object.values(Category).every(
            (category) => groupedVeggies[category] && groupedVeggies[category] >= 3,
          )
            ? AchievementLevel.Gold
            : AchievementLevel.NoAchievement,
          tearnado: achievementLevelHelper(
            [[5, AchievementLevel.Gold]],
            setIntersection(ONIONS, veggies).length,
          ),
          thirtyVeggies: achievementLevelHelper(
            [
              [40, AchievementLevel.Platinum],
              [30, AchievementLevel.Gold],
            ],
            veggies.length,
          ),
        };
      },
  );

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
      setIntersection(BEANS, uniqueVeggies.value).length,
    ),
    experimenterFruit: achievementLevelHelper(
      [[15, AchievementLevel.Gold]],
      setIntersection(FRUITS, uniqueVeggies.value).length,
    ),
    experimenterGrain: achievementLevelHelper(
      [[15, AchievementLevel.Gold]],
      setIntersection(GRAINS, uniqueVeggies.value).length,
    ),
    experimenterLeafy: achievementLevelHelper(
      [[15, AchievementLevel.Gold]],
      setIntersection(LEAFIES, uniqueVeggies.value).length,
    ),
    experimenterMushroom: achievementLevelHelper(
      [[15, AchievementLevel.Gold]],
      setIntersection(MUSHROOMS, uniqueVeggies.value).length,
    ),
    experimenterRoot: achievementLevelHelper(
      [[15, AchievementLevel.Gold]],
      setIntersection(ROOTS, uniqueVeggies.value).length,
    ),
    experimenterVegetable: achievementLevelHelper(
      [[15, AchievementLevel.Gold]],
      setIntersection(VEGETABLES, uniqueVeggies.value).length,
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

  const toggleVeggieForWeek = (targetVeggie: string, weekStart: Temporal.PlainDate) => {
    const targetWeek = weeksMap.value.get(weekStart.toString());
    if (!targetWeek) {
      weeks.value = [
        ...weeks.value,
        {
          startDate: weekStart,
          veggies: [targetVeggie],
          challenge: getRandomItem(availableVeggies.value)!,
        },
      ];
    } else if (!targetWeek.veggies.includes(targetVeggie)) {
      targetWeek.veggies = [...targetWeek.veggies, targetVeggie];
    } else {
      targetWeek.veggies = difference(targetWeek.veggies, [targetVeggie]);
    }
  };

  const setVeggiesForWeek = (
    veggies: string[],
    weekStart: Temporal.PlainDate = currentWeekStart.value,
  ) => {
    const targetWeek = weeksMap.value.get(weekStart.toString());
    if (!targetWeek) {
      weeks.value = [
        ...weeks.value,
        {
          startDate: weekStart,
          veggies,
          challenge: getRandomItem(availableVeggies.value)!,
        },
      ];
    } else {
      targetWeek.veggies = veggies;
    }
  };

  const $reset = () => {
    weeks.value = [];
  };

  return {
    achievements,
    allVeggies,
    challengeForWeek,
    atMostVeggies,
    completedChallenges,
    currentChallenge,
    currentVeggies,
    currentWeekStart,
    favorites,
    getWeekStarts,
    hotStreak,
    over30Veggies,
    suggestions,
    uniqueVeggies,
    veggiesByCategory,
    veggiesForWeek,
    weeklyAchievements,
    weeks,
    setVeggiesForWeek,
    toggleVeggie,
    toggleVeggieForWeek,
    $reset,
  };
});
