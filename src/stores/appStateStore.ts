import {ref} from 'vue';
import {defineStore} from 'pinia';
import {useStorage} from '@vueuse/core';
import type {Settings} from '@/utils/types';
import {DEFAULT_SETTINGS} from '@/utils/constants';

type Message = {
  id: string;
  text: string;
};

export const useAppStateStore = defineStore('appState', () => {
  // State refs
  const settings = useStorage<Settings>(
    'veggies-settings',
    {
      ...DEFAULT_SETTINGS,
    },
    localStorage,
    {
      mergeDefaults: true,
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
      ...DEFAULT_SETTINGS,
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
