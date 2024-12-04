<script lang="ts" setup>
import {storeToRefs} from 'pinia';
import {useAppStateStore} from '@/stores/appStateStore';
import ToastMessage from '@/components/ToastMessage.vue';

const appStateStore = useAppStateStore();
const {messages} = storeToRefs(appStateStore);
const {removeToastMessage} = appStateStore;
</script>
<template>
  <TransitionGroup
    tag="div"
    name="toasts"
    class="toast-container"
    aria-live="polite"
    @before-leave="() => console.log('before-leave')"
  >
    <ToastMessage
      v-for="message in messages"
      :key="message.id"
      :text="message.text"
      @close="removeToastMessage(message.id)"
    />
  </TransitionGroup>
</template>
<style lang="scss" scoped>
.toast-container {
  @apply absolute top-0 right-0 left-0 m-0 w-full z-30;
  @apply flex-container flex-col;
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
