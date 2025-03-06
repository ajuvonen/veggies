import {computed, ref, watchEffect} from 'vue';
import {defineStore, storeToRefs} from 'pinia';
import {useNow, useStorage} from '@vueuse/core';
import {DateTime} from 'luxon';
import {
  countBy,
  difference,
  entries,
  filter,
  map,
  pipe,
  prop,
  sortBy,
  take,
  takeWhile,
} from 'remeda';
import {Category, type Favorites, type Challenge, type Week} from '@/utils/types';
import {dateParser, getCategoryForVeggie, getRandomVeggie} from '@/utils/helpers';
import {useAchievements} from '@/hooks/achievements';
import {useAppStateStore} from '@/stores/appStateStore';

export const useActivityStore = defineStore('activity', () => {
  const {settings} = storeToRefs(useAppStateStore());
  const {advanceAchievements, achievements, resetAchievements} = useAchievements();
  const reactiveNow = useNow({interval: 2000});
  const currentDate = ref(DateTime.now());

  // State refs
  const startDate = useStorage<DateTime | null>('veggies-start-date', null, localStorage, {
    mergeDefaults: true,
    serializer: {
      read: (v) => (v ? DateTime.fromISO(JSON.parse(v).split('T')[0]) : null),
      write: (v) => JSON.stringify(v),
    },
  });

  const weeks = useStorage<Week[]>('veggies-weeks', [], localStorage, {
    mergeDefaults: true,
    serializer: {
      read: (v) => (v ? JSON.parse(v, dateParser) : null),
      write: (v) => JSON.stringify(v),
    },
  });

  const challenges = useStorage<Challenge[]>('veggies-challenges', [], localStorage, {
    mergeDefaults: true,
    serializer: {
      read: (v) => (v ? JSON.parse(v, dateParser) : null),
      write: (v) => JSON.stringify(v),
    },
  });

  // Computed getters
  const getWeekStarts = computed(() => {
    if (!startDate.value) return [currentDate.value.startOf('week')];
    const totalWeeks = Math.ceil(currentDate.value.diff(startDate.value, 'week').weeks);
    return [...Array(totalWeeks)]
      .map((_, weekIndex) => startDate.value!.plus({weeks: weekIndex}))
      .reverse();
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
    get: () => veggiesForWeek.value(currentDate.value.startOf('week')),
    set: (veggies: string[]) => setVeggiesForWeek(veggies),
  });

  const currentChallenge = computed(
    () =>
      challenges.value.find(({startDate}) => startDate.equals(currentDate.value.startOf('week')))
        ?.veggie,
  );

  const suggestions = computed(() =>
    pipe(
      allVeggies.value,
      filter((veggie) => !currentVeggies.value.includes(veggie)),
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
          take(5),
        ),
      }),
      {} as Favorites,
    ),
  );

  // Actions
  const toggleVeggie = (targetVeggie: string) => {
    const weekStart = currentDate.value.startOf('week');
    toggleVeggieForWeek(targetVeggie, weekStart);
  };

  const toggleVeggieForWeek = (targetVeggie: string, weekStart: DateTime) => {
    const targetWeek = weeks.value.find(({startDate}) => startDate.equals(weekStart));
    if (!targetWeek) {
      weeks.value.push({
        startDate: weekStart,
        veggies: [targetVeggie],
      });
      challenges.value.push({
        startDate: weekStart,
        veggie: getRandomVeggie(),
      });
    } else if (!targetWeek.veggies.includes(targetVeggie)) {
      targetWeek.veggies.push(targetVeggie);
    } else {
      targetWeek.veggies = difference(targetWeek.veggies, [targetVeggie]);
    }
  };

  const setVeggiesForWeek = (
    veggies: string[],
    weekStart: DateTime = currentDate.value.startOf('week'),
  ) => {
    const targetWeek = weeks.value.find(({startDate}) => startDate.equals(weekStart));
    if (!targetWeek) {
      weeks.value.push({
        startDate: weekStart,
        veggies,
      });
      challenges.value.push({
        startDate: weekStart,
        veggie: getRandomVeggie(),
      });
    } else {
      targetWeek.veggies = veggies;
    }
  };

  const $reset = () => {
    startDate.value = null;
    weeks.value = [];
    challenges.value = [];
    resetAchievements();
  };

  // Watchers
  watchEffect(() => {
    const now = DateTime.fromJSDate(reactiveNow.value) as DateTime<true>;
    if (!currentDate.value.hasSame(now, 'day')) {
      currentDate.value = now;
    }
  });

  watchEffect(() =>
    advanceAchievements({
      completedChallenges: completedChallenges.value,
      favorites: favorites.value,
      hotStreakLength: hotStreak.value,
      totalWeeks: weeks.value.length,
      uniqueVeggies: uniqueVeggies.value,
      veggiesThisWeek: currentVeggies.value.length,
    }),
  );

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
    weeks,
    setVeggiesForWeek,
    toggleVeggie,
    toggleVeggieForWeek,
    $reset,
  };
});
