import {computed, ref, watchEffect} from 'vue';
import {defineStore} from 'pinia';
import {useNow, useStorage} from '@vueuse/core';
import {DateTime} from 'luxon';
import {difference, entries, filter, groupBy, map, pipe, prop, sortBy, take, unique} from 'remeda';
import type {Challenge, Week} from '@/utils/types';
import {dateParser, getRandomVeggie} from '@/utils/helpers';

export const useActivityStore = defineStore('activity', () => {
  const reactiveNow = useNow({interval: 1000});
  const currentDate = ref(DateTime.now());
  watchEffect(() => {
    const now = DateTime.fromJSDate(reactiveNow.value) as DateTime<true>;
    if (!currentDate.value.hasSame(now, 'day')) {
      currentDate.value = now;
    }
  });

  // State refs
  const startDate = useStorage<DateTime | null>('veggies-start-date', null, localStorage, {
    mergeDefaults: true,
    serializer: {
      read: (v) => (v ? DateTime.fromISO(JSON.parse(v)) : null),
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
    return [...Array(totalWeeks)].map((_, weekIndex) => startDate.value!.plus({weeks: weekIndex}));
  });

  const hotStreak = computed(() => {
    const weekStarts = getWeekStarts.value;
    let maxStreak = 0;
    let currentStreak = 0;
    weekStarts.forEach((weekStart) => {
      if (veggiesForWeek.value(weekStart).length >= 30) {
        currentStreak++;
      } else {
        currentStreak = 0;
      }
      maxStreak = Math.max(maxStreak, currentStreak);
    });
    return maxStreak;
  });

  const allVeggies = computed(() => weeks.value.flatMap(prop('veggies')));

  const uniqueVeggies = computed(() => unique(allVeggies.value));

  const over30Veggies = computed(
    () => weeks.value.filter(({veggies}) => veggies.length >= 30).length,
  );

  const atMostVeggies = computed(() => Math.max(...weeks.value.map(({veggies}) => veggies.length)));

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
    set: (veggies: string[]) => {
      const weekStart = currentDate.value.startOf('week');
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
    },
  });

  const currentChallenge = computed(
    () =>
      challenges.value.find(({startDate}) => startDate.equals(currentDate.value.startOf('week')))
        ?.veggie,
  );

  const favorites = computed(() =>
    pipe(
      allVeggies.value,
      filter((veggie) => !currentVeggies.value.includes(veggie)),
      groupBy((veggie) => veggie),
      entries(),
      sortBy([([, {length}]) => length, 'desc']),
      map(prop(0)),
      take(10),
    ),
  );

  // Actions
  const toggleVeggie = (targetVeggie: string) => {
    const weekStart = currentDate.value.startOf('week');
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

  const $reset = () => {
    startDate.value = null;
    weeks.value = [];
    challenges.value = [];
  };

  return {
    startDate,
    weeks,
    challenges,
    getWeekStarts,
    hotStreak,
    completedChallenges,
    currentVeggies,
    currentChallenge,
    allVeggies,
    uniqueVeggies,
    over30Veggies,
    atMostVeggies,
    veggiesForWeek,
    favorites,
    toggleVeggie,
    $reset,
  };
});
