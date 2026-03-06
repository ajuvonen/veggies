<script setup lang="ts">
import {computed} from 'vue';
import type {IconString} from '@/components/ui/IconComponent.vue';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'tag'
  | 'remove'
  | 'text'
  | 'alternative';

defineEmits(['click']);
const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant | ButtonVariant[];
    icon?: IconString;
  }>(),
  {
    variant: 'primary',
  },
);

const getVariants = computed(() => {
  if (Array.isArray(props.variant)) {
    return props.variant.map((variant) => `button--${variant}`).join(' ');
  }

  return `button--${props.variant}`;
});
</script>
<template>
  <button
    :class="`button-like button ${getVariants}`"
    type="button"
    @click="$emit('click', $event)"
  >
    <IconComponent v-if="icon" :icon="icon" />
    <slot></slot>
  </button>
</template>
<style scoped>
.button {
  @apply text-[--color-text] fill-[--color-text];
}

.button--alternative {
  @apply text-[--color-text-alternative] fill-[--color-text-alternative];
}

.button--primary,
.button--tag {
  @apply bg-[--color-primary] hover:bg-[--color-primary-hover] active:bg-[--color-primary-active];
}

.button--secondary {
  @apply bg-[--color-bg-alternative] text-[--color-text-alternative] fill-[--color-text-alternative] hover:bg-[--color-primary-hover] active:bg-[--color-primary-active] active:text-[--color-text] active:fill-[--color-text] hover:text-[--color-text] hover:fill-[--color-text];
}

.button--text {
  @apply bg-transparent;
  @apply p-0 hover:underline;
}

.button--tag {
  @apply rounded-full text-xs;
}

.button--danger {
  @apply bg-red-500 dark:bg-red-700 hover:bg-red-600 active:bg-red-800;
}

.button--remove {
  @apply bg-green-500 dark:bg-green-700 hover:bg-red-600 active:bg-red-800;
}
</style>
