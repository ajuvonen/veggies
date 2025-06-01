<script setup lang="ts">
import {ref, watchEffect} from 'vue';
import {useElementHover, useTimeout, useSwipe, usePointer} from '@vueuse/core';
import {getRandomEmojis} from '@/utils/helpers';

defineProps<{
  text: string;
}>();

const emit = defineEmits(['close']);

const offsetX = ref(0);
const toastMessage = ref<HTMLDivElement | null>(null);
const toastTimeout = import.meta.env.MODE === 'ci' ? 100 : 5500;
const {start, stop} = useTimeout(toastTimeout, {
  callback: () => emit('close'),
  controls: true,
});

const {pointerType} = usePointer();

const {lengthX, isSwiping} = useSwipe(toastMessage, {
  onSwipe() {
    offsetX.value = -Math.round(lengthX.value);
  },
  onSwipeEnd() {
    if (Math.abs(offsetX.value) < 100) {
      offsetX.value = 0;
      return;
    } else if (offsetX.value < 0) {
      offsetX.value = window.innerWidth;
    } else {
      offsetX.value = -window.innerWidth;
    }
    emit('close');
  },
});

const isHovered = useElementHover(toastMessage);

watchEffect(() => {
  if (isHovered.value || isSwiping.value) {
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
      'toast-message--remove': Math.abs(offsetX) > 100,
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
  @apply w-full shadow-md p-4 transform transition-all duration-100 cursor-pointer;
  @apply bg-[--color-highlight];

  &--remove {
    @apply bg-red-500;
  }
}

.toast-message__content {
  @apply max-w-xl mx-auto;
  @apply flex-container justify-center items-center;
}
</style>
