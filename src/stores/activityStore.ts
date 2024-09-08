import {computed} from 'vue';
import {defineStore} from 'pinia';
import {useStorage} from '@vueuse/core';
import {DateTime} from 'luxon';
import {
  difference,
  entries,
  filter,
  groupBy,
  map,
  pipe,
  prop,
  sortBy,
  take,
  takeLastWhile,
  unique,
} from 'remeda';
import type {Challenge, Week} from '@/utils/types';
import {dateParser, getRandomVeggie} from '@/utils/helpers';

export const useActivityStore = defineStore('activity', () => {
  // State refs
  const startDate = useStorage<DateTime | null>('veggies-start-date', null, localStorage, {
    mergeDefaults: true,
    serializer: {
      read: (v: any) => (v ? DateTime.fromISO(JSON.parse(v)) : null),
      write: (v: any) => JSON.stringify(v),
    },
  });

  const weeks = useStorage<Week[]>('veggies-weeks', [], localStorage, {
    mergeDefaults: true,
    serializer: {
      read: (v: any) => (v ? JSON.parse(v, dateParser) : null),
      write: (v: any) => JSON.stringify(v),
    },
  });

  const challenges = useStorage<Challenge[]>('veggies-challenges', [], localStorage, {
    mergeDefaults: true,
    serializer: {
      read: (v: any) => (v ? JSON.parse(v, dateParser) : null),
      write: (v: any) => JSON.stringify(v),
    },
  });

  // Computed getters
  const getTotalWeeks = computed(() =>
    startDate.value ? Math.ceil(DateTime.now().diff(startDate.value, 'week').weeks) : 1,
  );

  const getWeekStarts = computed(() =>
    [...Array(getTotalWeeks.value)].map((_, weekIndex) =>
      startDate.value ? startDate.value.plus({weeks: weekIndex}) : DateTime.now().startOf('week'),
    ),
  );

  const hotStreak = computed(
    () =>
      takeLastWhile(getWeekStarts.value, (weekStart) => {
        const week = weeks.value.find(({startDate}) => startDate.equals(weekStart));
        return week ? week.veggies.length >= 30 : false;
      }).length,
  );

  const allVeggies = computed(() => weeks.value.flatMap(prop('veggies')));

  const uniqueVeggies = computed(() => unique(allVeggies.value));

  const veggiesForWeek = computed(
    () => (weekStart: DateTime) =>
      weeks.value.find(({startDate}) => startDate.equals(weekStart))?.veggies ?? [],
  );

  const currentVeggies = computed({
    get: () => veggiesForWeek.value(DateTime.now().startOf('week')),
    set: (veggies: string[]) => {
      const now = DateTime.now().startOf('week');
      const targetWeek = weeks.value.find(({startDate}) => startDate.equals(now));
      if (!targetWeek) {
        weeks.value.push({
          startDate: now,
          veggies,
        });
        challenges.value.push({
          startDate: now,
          veggie: getRandomVeggie(),
        });
      } else {
        targetWeek.veggies = veggies;
      }
    },
  });

  const currentChallenge = computed(
    () =>
      challenges.value.find(({startDate}) => startDate.equals(DateTime.now().startOf('week')))
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
    const now = DateTime.now().startOf('week');
    const targetWeek = weeks.value.find(({startDate}) => startDate.equals(now));
    if (!targetWeek) {
      weeks.value.push({
        startDate: now,
        veggies: [targetVeggie],
      });
      challenges.value.push({
        startDate: now,
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
    getTotalWeeks,
    hotStreak,
    currentVeggies,
    currentChallenge,
    allVeggies,
    uniqueVeggies,
    veggiesForWeek,
    favorites,
    toggleVeggie,
    $reset,
  };
});
