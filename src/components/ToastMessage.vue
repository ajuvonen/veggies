<script setup lang="ts">
import {useElementHover, useTimeout} from '@vueuse/core';
import {ref, watchEffect} from 'vue';

defineProps<{
  text: string;
}>();

const emit = defineEmits(['close']);

const toastMessage = ref<HTMLDivElement | null>(null);

const {start, stop} = useTimeout(5000, {
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
  '🌿',
];
const emoji = veggieEmojis[Math.floor(Math.random() * veggieEmojis.length)];
</script>
<template>
  <div ref="toastMessage" class="toast-message" @click="$emit('close')">
    <div class="toast-message__content">
      <span class="text-2xl" aria-hidden="true">
        {{ emoji }}
      </span>
      <span>{{ text }}</span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.toast-message {
  @apply w-full shadow-md p-4;
  @apply bg-sky-500;
}

.toast-message__content {
  @apply max-w-xl mx-auto;
  @apply flex-container justify-center items-center;
}
</style>
