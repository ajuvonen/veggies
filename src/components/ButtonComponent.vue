<script setup lang="ts">
import {computed} from 'vue';
import type {IconString} from '@/components/IconComponent.vue';

export type ButtonVariant = 'primary' | 'danger' | 'tag' | 'remove' | 'text';

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
  <button @click="$emit('click')" :class="`button ${getVariants}`">
    <IconComponent v-if="icon" :icon="icon" />
    <slot></slot>
  </button>
</template>
<style scoped>
.button {
  @apply button-like;
  @apply flex-container items-center;
}

.button--primary,
.button--tag {
  @apply bg-sky-500;

  &:hover {
    @apply bg-sky-600;
  }
}

.button--text {
  @apply bg-transparent;
  @apply p-0;

  &:hover {
    @apply underline;
  }
}

.button--tag {
  @apply rounded-full text-xs;
}

.button--danger {
  @apply bg-red-500;

  &:hover {
    @apply bg-red-600;
  }
}

.button--remove {
  @apply bg-green-500;

  &:hover {
    @apply bg-red-600;
  }
}
</style>
