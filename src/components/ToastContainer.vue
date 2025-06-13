<script lang="ts" setup>
import {storeToRefs} from 'pinia';
import {useAppStateStore} from '@/stores/appStateStore';
import ToastMessage from '@/components/ToastMessage.vue';

const appStateStore = useAppStateStore();
const {messages} = storeToRefs(appStateStore);
const {removeToastMessage} = appStateStore;
</script>
<template>
  <TransitionGroup tag="div" name="toasts" class="toast-container" aria-live="polite">
    <ToastMessage
      v-for="message in messages"
      :key="message.id"
      :text="message.text"
      @close="removeToastMessage(message.id)"
    />
  </TransitionGroup>
</template>
<style scoped>
.toast-container {
  @apply fixed inset-0 h-[100dvh] m-0 w-full z-30 pointer-events-none;
  @apply flex-container flex-col-reverse;
}

.toasts-move,
.toasts-enter-active,
.toasts-leave-active {
  transition: all 0.5s ease;
}

.toasts-leave-from,
.toasts-enter-to {
  opacity: 1;
}

.toasts-enter-from,
.toasts-leave-to {
  opacity: 0;
}

.toasts-leave-active {
  @apply absolute;
}
</style>
