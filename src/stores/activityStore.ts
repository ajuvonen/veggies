import {defineStore} from 'pinia';
import {useStorage} from '@vueuse/core';
import {DateTime} from 'luxon';
import type {Action, Settings} from '@/utils/types';

export const useActivityStore = defineStore('activity', () => {
  // State refs
  const settings = useStorage<Settings>(
    'veggies-settings',
    {
      startDate: null,
    },
    localStorage,
    {
      mergeDefaults: true,
      serializer: {
        read: (v: any) =>
          v
            ? JSON.parse(v, (key, value) => {
                if (key === 'startDate' && value) {
                  return DateTime.fromISO(value).toJSDate();
                }
                return value;
              })
            : null,
        write: (v: any) => JSON.stringify(v),
      },
    },
  );

  const activity = useStorage<Action[]>('veggies-activity', [], localStorage, {
    mergeDefaults: true,
  });

  const $reset = () => {
    settings.value = {
      startDate: null,
    };
    activity.value = [];
  };

  return {settings, activity, $reset};
});
