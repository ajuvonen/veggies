import {computed} from 'vue';
import {defineStore} from 'pinia';
import {useStorage} from '@vueuse/core';
import {DateTime} from 'luxon';
import type {Activity, Ingredient, Settings, TranslatedIngredient} from '@/utils/types';

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

  const toggleIngredient = (newIngredient: Ingredient | TranslatedIngredient) => {
    const now = DateTime.now();
    const existing = activities.value.find(
      ({ingredient, date}) => ingredient.key === newIngredient.key && date.hasSame(now, 'week'),
    );
    if (!existing) {
      activities.value.push({
        ingredient: {
          key: newIngredient.key,
          category: newIngredient.category,
        },
        date: now,
      });
    } else {
      activities.value = activities.value.filter((activity) => activity !== existing);
    }
  };

  const getCurrentIngredients = computed(() =>
    activities.value
      .filter(({date}) => date.hasSame(DateTime.now(), 'week'))
      .map(({ingredient}) => ingredient),
  );

  const getIngredientsForWeek = computed(
    () => (weekIndex: number) =>
      activities.value
        .filter(({date}) =>
          date.hasSame(settings.value.startDate?.plus({weeks: weekIndex})!, 'week'),
        )
        .map(({ingredient}) => ingredient),
  );

  const $reset = () => {
    settings.value = {
      startDate: null,
    };
    activities.value = [];
  };

  return {
    settings,
    activities,
    getCurrentIngredients,
    getIngredientsForWeek,
    toggleIngredient,
    $reset,
  };
});
