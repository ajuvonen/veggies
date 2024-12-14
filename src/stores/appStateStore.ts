import {ref, watchEffect} from 'vue';
import {defineStore, storeToRefs} from 'pinia';
import {useStorage} from '@vueuse/core';
import type {Settings} from '@/utils/types';
import {useAchievements} from '@/hooks/achievements';
import {useActivityStore} from '@/stores/activityStore';

type Message = {
  id: string;
  text: string;
};

export const useAppStateStore = defineStore('appState', () => {
  const {advanceAchievements, achievements, resetAchievements} = useAchievements();
  const {currentVeggies, uniqueVeggies, hotStreak, weeks, completedChallenges, favorites} =
    storeToRefs(useActivityStore());

  watchEffect(() =>
    advanceAchievements(
      currentVeggies.value.length,
      uniqueVeggies.value,
      hotStreak.value,
      weeks.value.length,
      completedChallenges.value,
      favorites.value,
    ),
  );

  // State refs
  const settings = useStorage<Settings>(
    'veggies-settings',
    {
      locale: 'en',
    },
    localStorage,
    {
      mergeDefaults: true,
    },
  );

  const messages = ref<Message[]>([]);

  const addToastMessage = (text: string) => {
    messages.value.push({
      id: crypto.randomUUID(),
      text,
    });
  };

  const removeToastMessage = (targetId: string) => {
    messages.value = messages.value.filter(({id}) => id !== targetId);
  };

  const $reset = () => {
    messages.value = [];
    settings.value = {
      locale: 'en',
    };
    resetAchievements();
  };

  return {
    messages,
    settings,
    achievements,
    addToastMessage,
    removeToastMessage,
    $reset,
  };
});
