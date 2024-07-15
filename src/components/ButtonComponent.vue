<script setup lang="ts">
import {computed} from 'vue';
import {type IconString} from '@/components/IconComponent.vue';

defineEmits(['click']);

export type ButtonVariant = 'primary' | 'danger' | 'tag';

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
  <button @click="$emit('click')" :class="`button ${getVariants} flex-container`">
    <IconComponent v-if="icon" :icon="icon" />
    <slot></slot>
  </button>
</template>
<style scoped lang="scss">
.button {
  letter-spacing: 1px;
  @apply text-nowrap px-4 py-2 font-semibold text-sm uppercase rounded-md select-none;
  @apply bg-sky-400;

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
