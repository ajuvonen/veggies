import {computed} from 'vue';
import {defineStore} from 'pinia';
import {useStorage} from '@vueuse/core';
import {DateTime} from 'luxon';
import type {Activity, Settings} from '@/utils/types';
import {entries, filter, groupBy, map, pipe, prop, sortBy, take} from 'remeda';

const localStorageOptions = {
  mergeDefaults: true,
  serializer: {
    read: (v: any) =>
      v
        ? JSON.parse(v, (key, value) => {
            if (['startDate', 'date'].includes(key) && value) {
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

  const activities = useStorage<Activity[]>(
    'veggies-activity',
    [],
    localStorage,
    localStorageOptions,
  );

  // Computed getters
  const currentVeggies = computed(() =>
    activities.value.filter(({date}) => date.hasSame(DateTime.now(), 'week')).map(prop('veggie')),
  );

  const allVeggies = computed(() => activities.value.map(prop('veggie')));

  const veggiesForWeek = computed(
    () => (weekIndex: number) =>
      activities.value
        .filter(({date}) =>
          date.hasSame(settings.value.startDate?.plus({weeks: weekIndex})!, 'week'),
        )
        .map(prop('veggie')),
  );

  const favorites = computed(() =>
    pipe(
      activities.value,
      filter(({veggie}) => !currentVeggies.value.includes(veggie)),
      groupBy(prop('veggie')),
      entries(),
      sortBy([([, {length}]) => length, 'desc']),
      map(prop(0)),
      take(10),
    ),
  );

  // Actions
  const toggleVeggie = (veggie: string) => {
    const now = DateTime.now();
    const existing = activities.value.find(
      (activity) => activity.veggie === veggie && activity.date.hasSame(now, 'week'),
    );
    if (!existing) {
      activities.value.push({
        veggie,
        date: now,
      });
    } else {
      activities.value = activities.value.filter((activity) => activity !== existing);
    }
  };

  const $reset = () => {
    settings.value = {
      locale: 'en',
      startDate: null,
    };
    activities.value = [];
  };

  return {
    settings,
    activities,
    currentVeggies,
    allVeggies,
    veggiesForWeek,
    favorites,
    toggleVeggie,
    $reset,
  };
});
