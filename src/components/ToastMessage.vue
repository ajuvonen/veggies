<script setup lang="ts">
import {useElementHover, useTimeout} from '@vueuse/core';
import {ref, watchEffect} from 'vue';

defineProps<{
  text: string;
  rounded: boolean;
}>();

const emit = defineEmits(['close']);

const toastMessage = ref<HTMLDivElement | null>(null);

const {start, stop} = useTimeout(4000, {
  callback: () => emit('close'),
  controls: true,
});

const isHovered = useElementHover(toastMessage);

watchEffect(() => {
  if (isHovered.value) {
    stop();
  } else {
    start();
  }
});

const veggieEmojis = [
  '🥝',
  '🥥',
  '🍇',
  '🍈',
  '🍉',
  '🍊',
  '🍋',
  '🍌',
  '🍍',
  '🥭',
  '🍎',
  '🍏',
  '🍐',
  '🍑',
  '🍒',
  '🍓',
  '🫐',
  '🍅',
  '🍆',
  '🌽',
  '🌶️',
  '🫑',
  '🥑',
  '🥒',
  '🥬',
  '🥦',
  '🥔',
  '🧄',
  '🧅',
  '🥕',
  '🫛',
  '🥜',
  '🫘',
];
const emoji = veggieEmojis[Math.floor(Math.random() * veggieEmojis.length)];
</script>
<template>
  <div
    ref="toastMessage"
    class="toast-message"
    :class="{'toast-message--rounded': rounded}"
    @click="$emit('close')"
  >
    <div class="flex items-center text-2xl">
      {{ emoji }}
    </div>
    <div class="flex items-center">{{ text }}</div>
  </div>
</template>
<style lang="scss" scoped>
.toast-message {
  @apply w-full shadow-md p-4;
  @apply bg-sky-500;
  @apply flex-container;
}

.toast-message--rounded {
  @apply rounded-md;
}
</style>
