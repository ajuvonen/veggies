import {ref} from 'vue';
import {defineStore} from 'pinia';
import {useStorage} from '@vueuse/core';
import type {Settings} from '@/utils/types';

type Message = {
  id: string;
  text: string;
};

export const useAppStateStore = defineStore('appState', () => {
  // State refs
  const settings = useStorage<Settings>(
    'veggies-settings',
    {
      locale: 'en',
      suggestionCount: 10,
    },
    localStorage,
    {
      mergeDefaults: true,
    },
  );

  const messages = ref<Message[]>([]);

  // Actions
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
      suggestionCount: 10,
    };
  };

  return {
    messages,
    settings,
    addToastMessage,
    removeToastMessage,
    $reset,
  };
});
