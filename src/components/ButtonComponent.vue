<script setup lang="ts">
import {type IconString} from '@/components/IconComponent.vue';

defineEmits(['click']);
withDefaults(
  defineProps<{
    variant?: 'primary' | 'danger' | 'tag';
    icon?: IconString;
  }>(),
  {
    variant: 'primary',
  },
);
</script>
<template>
  <button @click="$emit('click')" :class="`button button--${variant}`">
    <IconComponent v-if="icon" :icon="icon" />
    <slot></slot>
  </button>
</template>
<style scoped lang="scss">
.button {
  letter-spacing: 1px;
  @apply flex gap-2;
  @apply px-4 py-2 font-semibold text-sm uppercase rounded-md select-none;
  @apply bg-sky-400 fill-white text-white;

  &:hover {
    @apply bg-sky-500;
  }
}

.button--primary,
.button--tag {
  @apply bg-sky-500;

  &:hover,
  &:focus {
    @apply bg-sky-600;
  }
}

.button--tag {
  @apply rounded-full;
}

.button--danger {
  @apply bg-red-500;

  &:hover,
  &:focus {
    @apply bg-red-600;
  }
}
</style>
