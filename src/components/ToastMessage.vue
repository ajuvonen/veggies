<script setup lang="ts">
import {getRandomEmojis} from '@/utils/helpers';
import {useElementHover, useTimeout, useFocus} from '@vueuse/core';
import {ref, watchEffect} from 'vue';

defineProps<{
  text: string;
}>();

const emit = defineEmits(['close']);

const toastMessage = ref<HTMLDivElement | null>(null);

const {start, stop} = useTimeout(5500, {
  callback: () => emit('close'),
  controls: true,
});

const isHovered = useElementHover(toastMessage);
const {focused} = useFocus(toastMessage);

watchEffect(() => {
  if (isHovered.value || focused.value) {
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
    class="toast-message"
    role="status"
    tabindex="0"
    data-test-id="toast-message"
    @click="$emit('close')"
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
<style lang="scss" scoped>
.toast-message {
  @apply w-full shadow-md p-4;
  @apply bg-sky-500;

  &:focus {
    @apply -outline-offset-2;
  }
}

.toast-message__content {
  @apply max-w-xl mx-auto;
  @apply flex-container justify-center items-center;
}
</style>
