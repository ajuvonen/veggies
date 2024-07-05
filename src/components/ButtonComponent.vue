<script setup lang="ts">
import IconComponent, {type IconString} from '@/components/IconComponent.vue';

defineEmits(['click']);
withDefaults(
  defineProps<{
    variant?: 'primary' | 'danger';
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
  @apply px-4 py-2 text-white font-semibold text-sm uppercase rounded-md;
  @apply bg-sky-400 fill-white;

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
