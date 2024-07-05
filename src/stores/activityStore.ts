import {defineStore} from 'pinia';
import {useStorage} from '@vueuse/core';
import {DateTime} from 'luxon';
import type {Action, Settings} from '@/utils/types';
import {computed} from 'vue';

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

  const activity = useStorage<Action[]>('veggies-activity', [], localStorage, localStorageOptions);

  const toggleIngredient = (newIngredient: string) => {
    const now = DateTime.now();
    const existing = activity.value.find(
      ({ingredient, date}) => ingredient === newIngredient && date.hasSame(now, 'week'),
    );
    if (!existing) {
      activity.value.push({
        ingredient: newIngredient,
        date: now,
      });
    } else {
      activity.value = activity.value.filter((action) => action !== existing);
    }
  };

  const currentIngredients = computed(() =>
    activity.value
      .filter(({date}) => date.hasSame(DateTime.now(), 'week'))
      .map(({ingredient}) => ingredient),
  );

  const $reset = () => {
    settings.value = {
      startDate: null,
    };
    activity.value = [];
  };

  return {settings, activity, currentIngredients, toggleIngredient, $reset};
});
