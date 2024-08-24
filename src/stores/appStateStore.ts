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
  const {advance, achievements, reset} = useAchievements();
  const {uniqueVeggies} = storeToRefs(useActivityStore());

  watchEffect(() => {
    advance(uniqueVeggies.value, 0);
  });

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
    reset();
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
