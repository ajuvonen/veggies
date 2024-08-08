import {ref} from 'vue';
import {defineStore} from 'pinia';

type Message = {
  id: string;
  text: string;
};

export const useAppStateStore = defineStore('appState', () => {
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
  };

  return {
    messages,
    addToastMessage,
    removeToastMessage,
    $reset,
  };
});
