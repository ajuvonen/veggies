import {ref} from 'vue';
import {defineStore} from 'pinia';
import {useLocalStorage} from '@vueuse/core';
import type {Settings} from '@/types';
import {DEFAULT_SETTINGS} from '@/utils/constants';
import {dateParser, dateReplacer} from '@/utils/helpers';

type Message = {
  id: string;
  text: string;
};

export const useAppStateStore = defineStore('appState', () => {
  // State refs
  const settings = useLocalStorage<Settings>(
    'veggies-settings',
    {
      ...DEFAULT_SETTINGS,
    },
    {
      mergeDefaults: true,
      serializer: {
        read: (v) => (v ? JSON.parse(v, dateParser) : null),
        write: (v) => JSON.stringify(v, dateReplacer),
      },
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
