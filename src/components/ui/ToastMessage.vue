<script setup lang="ts">
import {ref, useTemplateRef, watchEffect} from 'vue';
import {useElementHover, useTimeout, useSwipe, usePointer} from '@vueuse/core';
import {getRandomEmojis} from '@/utils/helpers';

const isCIMode = import.meta.env.MODE === 'ci';
const props = defineProps<{
  text: string;
  focused: boolean;
  messageId: string;
}>();

const emit = defineEmits(['close']);

const removing = ref(false);
const offsetX = ref(0);
const toastMessage = useTemplateRef('toastMessage');
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
  if (!isCIMode && (isHovered.value || isSwiping.value || removing.value || props.focused)) {
    stop();
  } else {
    start();
  }
});

const handleClick = (event: MouseEvent) => {
  // event.detail is 0 for clicks synthesized by keyboard activation (Enter/Space) and
  // >0 for real pointer clicks, including touch taps. Touch taps are excluded so the
  // deliberate swipe gesture stays the only way to dismiss on touch, while keyboard
  // activation always closes regardless of the last recorded pointer type.
  if (event.detail === 0 || pointerType.value !== 'touch') {
    emit('close');
  }
};

const emoji = getRandomEmojis()[0];
</script>
<template>
  <!-- mousedown.prevent: clicking must not steal focus, e.g. from the veggie search input -->
  <button
    :id="`toast-${messageId}`"
    ref="toastMessage"
    :style="{transform: `translateX(${offsetX}px)`}"
    :class="{
      'toast-message--remove': Math.abs(offsetX) > 50,
      'toast-message--removing': removing,
    }"
    :aria-label="$t('general.ariaDismiss', [text])"
    class="toast-message"
    type="button"
    data-test-id="toast-message"
    @click="handleClick"
    @mousedown.prevent
  >
    <div class="toast-message__content">
      <span class="text-2xl" aria-hidden="true">
        {{ emoji }}
      </span>
      <span>{{ text }}</span>
    </div>
  </button>
</template>
<style scoped>
@reference '@/assets/main.css';

.toast-message {
  @apply w-full p-4 pointer-events-auto -outline-offset-2;
  @apply bg-primary;
  box-shadow:
    0 -4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.toast-message--remove {
  @apply bg-danger;
}

.toast-message--removing {
  @apply opacity-0 motion-safe:duration-200;
}

.toast-message__content {
  @apply max-w-xl mx-auto;
  @apply cluster justify-center items-center;
}
</style>
