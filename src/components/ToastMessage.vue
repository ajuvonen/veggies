<script setup lang="ts">
import {getRandomEmojis} from '@/utils/helpers';
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

const emoji = getRandomEmojis();
</script>
<template>
  <div
    ref="toastMessage"
    class="toast-message"
    data-test-id="toast-message"
    @click="$emit('close')"
  >
    <div class="toast-message__content">
      <span class="text-2xl" aria-hidden="true">
        {{ emoji[0] }}
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
