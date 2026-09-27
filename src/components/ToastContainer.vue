<script lang="ts" setup>
import {nextTick, useTemplateRef} from 'vue';
import {storeToRefs} from 'pinia';
import {useFocusWithin} from '@vueuse/core';
import {useAppStateStore} from '@/stores/appStateStore';
import {useScreen} from '@/hooks/screen';
import {focusPageHeading} from '@/utils/helpers';

const appStateStore = useAppStateStore();
const {messages} = storeToRefs(appStateStore);
const {removeToastMessage} = appStateStore;

const toasts = useTemplateRef('toasts');

const {maxHeight} = useScreen(toasts);
const {focused} = useFocusWithin(toasts);

const handleClose = async (id: string) => {
  const wasFocused = document.activeElement === document.getElementById(`toast-${id}`);
  const index = messages.value.findIndex((message) => message.id === id);
  removeToastMessage(id);
  if (!wasFocused) {
    return;
  }
  await nextTick();
  const nextMessage = messages.value[index] ?? messages.value[index - 1];
  const nextElement = nextMessage && document.getElementById(`toast-${nextMessage.id}`);
  if (nextElement) {
    nextElement.focus({preventScroll: true});
  } else {
    focusPageHeading();
  }
};
</script>
<template>
  <TransitionGroup
    ref="toasts"
    :style="`max-height: ${maxHeight}px`"
    tag="div"
    name="toasts"
    class="toast-container"
    aria-live="polite"
  >
    <ToastMessage
      v-for="message in messages"
      :key="message.id"
      :text="message.text"
      :focused="focused"
      :messageId="message.id"
      @close="handleClose(message.id)"
    />
  </TransitionGroup>
</template>
<style scoped>
@reference '@/assets/main.css';

.toast-container {
  @apply absolute inset-0 z-40 pointer-events-none;
  @apply cluster flex-col-reverse;
}

.toasts-move,
.toasts-enter-active,
.toasts-leave-active {
  @apply motion-safe:duration-200 ease-out;
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
