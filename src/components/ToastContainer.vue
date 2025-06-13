<script lang="ts" setup>
import {ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useAppStateStore} from '@/stores/appStateStore';
import {useScreen} from '@/hooks/screen';
import ToastMessage from '@/components/ToastMessage.vue';

const appStateStore = useAppStateStore();
const {messages} = storeToRefs(appStateStore);
const {removeToastMessage} = appStateStore;

const toasts = ref<HTMLElement | null>(null);

const {maxHeightStyle} = useScreen(toasts, 0);
</script>
<template>
  <TransitionGroup
    ref="toasts"
    :style="maxHeightStyle"
    tag="div"
    name="toasts"
    class="toast-container"
    aria-live="polite"
  >
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
  @apply absolute inset-0 m-0 w-full z-30 pointer-events-none;
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
