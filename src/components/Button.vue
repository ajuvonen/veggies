<script setup lang="ts">
defineEmits(['click']);
withDefaults(
  defineProps<{
    variant?: 'primary' | 'danger';
  }>(),
  {
    variant: 'primary',
  },
);
</script>
<template>
  <button @click="$emit('click')" :class="`button button--${variant}`">
    <slot></slot>
  </button>
</template>
<style scoped lang="scss">
.button {
  letter-spacing: 1px;
  @apply px-4 py-2 text-white font-semibold text-sm uppercase rounded-md;
  @apply bg-sky-400;

  &:hover {
    @apply bg-sky-500;
  }
}

.button--primary {
  @apply bg-sky-400;

  &:hover {
    @apply bg-sky-500;
  }
}

.button--danger {
  @apply bg-red-500;

  &:hover {
    @apply bg-red-600;
  }
}
</style>
