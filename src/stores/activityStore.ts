import {computed} from 'vue';
import {defineStore} from 'pinia';
import {useStorage} from '@vueuse/core';
import {DateTime} from 'luxon';
import type {Activity, Category, Ingredient, Settings} from '@/utils/types';
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
  const getCurrentIngredients = computed(() =>
    activities.value
      .filter(({date}) => date.hasSame(DateTime.now(), 'week'))
      .map(({ingredient}) => ingredient),
  );

  const getExistingActivityByIngredient = computed(
    () => (key: string) =>
      activities.value.find(
        ({ingredient, date}) => ingredient.key === key && date.hasSame(DateTime.now(), 'week'),
      ),
  );

  const getIngredientsForWeek = computed(
    () => (weekIndex: number) =>
      activities.value
        .filter(({date}) =>
          date.hasSame(settings.value.startDate?.plus({weeks: weekIndex})!, 'week'),
        )
        .map(({ingredient}) => ingredient),
  );

  const getFavorites = computed(() => {
    console.log(DateTime.now().toMillis());
    const favorites = pipe(
      activities.value,
      filter(({ingredient: {key}}) => !getExistingActivityByIngredient.value(key)),
      map(prop('ingredient')),
      groupBy(prop('key')),
      entries<Record<string, Ingredient[]>>,
      sortBy([([_, {length}]) => length, 'desc']),
      map(([key, ingredients]) => [key, ingredients[0].category] as [string, Category]),
      take(10),
    );
    console.log(DateTime.now().toMillis());
    return favorites;
  });

  // Actions
  const toggleIngredient = (key: string, category: Category) => {
    const existing = getExistingActivityByIngredient.value(key);
    if (!existing) {
      activities.value.push({
        ingredient: {
          key,
          category,
        },
        date: DateTime.now(),
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
    getCurrentIngredients,
    getIngredientsForWeek,
    getFavorites,
    toggleIngredient,
    $reset,
  };
});
