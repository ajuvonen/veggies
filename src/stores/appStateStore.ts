import {ref} from 'vue';
import {defineStore} from 'pinia';
import {debounceFilter, useStorage} from '@vueuse/core';
import type {Settings} from '@/utils/types';
import {DEFAULT_LOCALE} from '@/utils/constants';

type Message = {
  id: string;
  text: string;
};

export const useAppStateStore = defineStore('appState', () => {
  // State refs
  const settings = useStorage<Settings>(
    'veggies-settings',
    {
      disableAnimations: false,
      locale: DEFAULT_LOCALE,
      suggestionCount: 10,
    },
    localStorage,
    {
      mergeDefaults: true,
      eventFilter: debounceFilter(2000),
    },
  );

  const messages = ref<Message[]>([]);

  // Actions
  const addToastMessage = (text: string) => {
    messages.value = [
      ...messages.value,
      {
        id: crypto.randomUUID(),
        text,
      },
    ];
  };

  const removeToastMessage = (targetId: string) => {
    messages.value = messages.value.filter(({id}) => id !== targetId);
  };

  const $reset = () => {
    messages.value = [];
    settings.value = {
      disableAnimations: false,
      locale: DEFAULT_LOCALE,
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
