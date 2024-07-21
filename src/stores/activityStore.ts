import {computed} from 'vue';
import {defineStore} from 'pinia';
import {useStorage} from '@vueuse/core';
import {DateTime} from 'luxon';
import {difference, entries, filter, groupBy, map, pipe, prop, sortBy, take} from 'remeda';
import type {Settings, Week} from '@/utils/types';

const localStorageOptions = {
  mergeDefaults: true,
  serializer: {
    read: (v: any) =>
      v
        ? JSON.parse(v, (key, value) => {
            if (['startDate'].includes(key) && value) {
              return DateTime.fromISO(value);
            }
            return value;
          })
        : null,
    write: (v: any) => JSON.stringify(v),
  },
};

export const useActivityStore = defineStore('activity', () => {
  // State refs
  const settings = useStorage<Settings>(
    'veggies-settings',
    {
      locale: 'en',
      startDate: null,
    },
    localStorage,
    localStorageOptions,
  );

  const weeks = useStorage<Week[]>('veggies-weeks', [], localStorage, localStorageOptions);

  // Computed getters

  const allVeggies = computed(() => weeks.value.flatMap(prop('veggies')));

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
    settings.value = {
      locale: 'en',
      startDate: null,
    };
    weeks.value = [];
  };

  return {
    settings,
    weeks,
    currentVeggies,
    allVeggies,
    veggiesForWeek,
    favorites,
    toggleVeggie,
    $reset,
  };
});
