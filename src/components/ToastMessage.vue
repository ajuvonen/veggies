<script setup lang="ts">
import {ref, watchEffect} from 'vue';
import {useElementHover, useTimeout, useSwipe, usePointer} from '@vueuse/core';
import {getRandomEmojis} from '@/utils/helpers';

const isCIMode = import.meta.env.MODE === 'ci';
defineProps<{
  text: string;
}>();

const emit = defineEmits(['close']);

const removing = ref(false);
const offsetX = ref(0);
const toastMessage = ref<HTMLDivElement | null>(null);
const toastTimeout = isCIMode ? 100 : 5500;
const {start, stop} = useTimeout(toastTimeout, {
  callback: () => emit('close'),
  controls: true,
});

const {pointerType} = usePointer();

const {lengthX, isSwiping} = useSwipe(toastMessage, {
  threshold: 0,
  onSwipe() {
    offsetX.value = -Math.round(lengthX.value);
  },
  onSwipeEnd() {
    if (Math.abs(lengthX.value) > 50) {
      offsetX.value = lengthX.value < 0 ? window.innerWidth : -window.innerWidth;
      removing.value = true;
      setTimeout(() => {
        emit('close');
      }, 200);
    } else {
      offsetX.value = 0;
    }
  },
});

const isHovered = useElementHover(toastMessage);

watchEffect(() => {
  if (!isCIMode && (isHovered.value || isSwiping.value || removing.value)) {
    stop();
  } else {
    start();
  }
});

const emoji = getRandomEmojis()[0];
</script>
<template>
  <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
  <div
    ref="toastMessage"
    :style="{transform: `translateX(${offsetX}px)`}"
    :class="{
      'toast-message--remove': Math.abs(offsetX) > 50,
      'toast-message--removing': removing,
    }"
    class="toast-message"
    role="status"
    data-test-id="toast-message"
    @click="pointerType !== 'touch' && emit('close')"
    @keydown.enter="$emit('close')"
  >
    <div class="toast-message__content">
      <span class="text-2xl" aria-hidden="true">
        {{ emoji }}
      </span>
      <span>{{ text }}</span>
    </div>
  </div>
</template>
<style scoped>
.toast-message {
  @apply w-full p-4 cursor-pointer pointer-events-auto;
  @apply bg-[--color-highlight];
  box-shadow:
    0 -4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);

  &--remove {
    @apply bg-red-500;
  }

  &--removing {
    @apply opacity-0 transition-all duration-200;
  }
}

.toast-message__content {
  @apply max-w-xl mx-auto;
  @apply flex-container justify-center items-center;
}
</style>
