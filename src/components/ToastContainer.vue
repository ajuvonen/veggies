<script lang="ts" setup>
import {storeToRefs} from 'pinia';
import useScreen from '@/hooks/screen';
import {useAppStateStore} from '@/stores/appStateStore';
import ToastMessage from '@/components/ToastMessage.vue';

const {isSmallScreen} = useScreen();

const appStateStore = useAppStateStore();
const {messages} = storeToRefs(appStateStore);
const {removeToastMessage} = appStateStore;
</script>
<template>
  <div
    class="toast-container"
    :class="{'toast-container--mobile': isSmallScreen}"
    aria-live="polite"
  >
    <TransitionGroup name="toasts">
      <ToastMessage
        v-for="message in messages"
        :key="message.id"
        :text="message.text"
        :rounded="!isSmallScreen"
        @close="removeToastMessage(message.id)"
      />
    </TransitionGroup>
  </div>
</template>
<style lang="scss" scoped>
.toast-container {
  @apply absolute top-0 right-0 w-80 h-fit mt-4 mr-4 z-20;
  @apply flex-container flex-col;
}

.toast-container--mobile {
  @apply left-0 m-0 w-full;
}

.toasts-move,
.toasts-enter-active,
.toasts-leave-active {
  transition: all 0.5s ease;
}

.toasts-enter-from,
.toasts-leave-to {
  opacity: 0;
  transform: translateY(-60px);
}

.toasts-leave-active {
  @apply absolute;
}
</style>
