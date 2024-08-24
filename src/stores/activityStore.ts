import {computed} from 'vue';
import {defineStore} from 'pinia';
import {useStorage} from '@vueuse/core';
import {DateTime} from 'luxon';
import {difference, entries, filter, groupBy, map, pipe, prop, sortBy, take, unique} from 'remeda';
import type {Week} from '@/utils/types';

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
      read: (v: any) =>
        v
          ? JSON.parse(v, (key, value) => {
              if (key === 'startDate' && value) {
                return DateTime.fromISO(value);
              }
              return value;
            })
          : null,
      write: (v: any) => JSON.stringify(v),
    },
  });

  // Computed getters

  const allVeggies = computed(() => weeks.value.flatMap(prop('veggies')));

  const uniqueVeggies = computed(() => unique(allVeggies.value));

  const veggiesForWeek = computed(
    () => (weekStart: DateTime) =>
      weeks.value.find(({startDate}) => startDate.equals(weekStart))?.veggies ?? [],
  );

  const currentVeggies = computed(() => veggiesForWeek.value(DateTime.now().startOf('week')));

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
    } else if (!targetWeek.veggies.includes(targetVeggie)) {
      targetWeek.veggies.push(targetVeggie);
    } else {
      targetWeek.veggies = difference(targetWeek.veggies, [targetVeggie]);
    }
  };

  const $reset = () => {
    startDate.value = null;
    weeks.value = [];
  };

  return {
    startDate,
    weeks,
    currentVeggies,
    allVeggies,
    uniqueVeggies,
    veggiesForWeek,
    favorites,
    toggleVeggie,
    $reset,
  };
});
