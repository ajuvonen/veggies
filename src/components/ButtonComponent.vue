<script setup lang="ts">
import {computed} from 'vue';
import type {IconString} from '@/components/IconComponent.vue';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'tag' | 'remove' | 'text';

defineEmits(['click']);
const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant | ButtonVariant[];
    icon?: IconString;
  }>(),
  {
    variant: () => 'primary',
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
  <button @click="$emit('click')" :class="`button-like ${getVariants}`">
    <IconComponent v-if="icon" :icon="icon" />
    <slot></slot>
  </button>
</template>
<style scoped>
.button--primary,
.button--tag {
  @apply bg-[--color-highlight] hover:bg-sky-600;
}

.button--secondary {
  @apply bg-[--color-bg-alternative] text-[--color-text-alternative] hover:bg-sky-600 hover:text-[--color-text];
}

.button--text {
  @apply bg-transparent;
  @apply p-0 hover:underline;
}

.button--tag {
  @apply rounded-full text-xs;
}

.button--danger {
  @apply bg-red-500 dark:bg-red-700 hover:bg-red-600;
}

.button--remove {
  @apply bg-green-500 dark:bg-green-700 hover:bg-red-600;
}
</style>
