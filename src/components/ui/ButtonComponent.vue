<script setup lang="ts">
import {tv, type VariantProps} from 'tailwind-variants/lite';
import type {IconString} from '@/components/ui/IconComponent.vue';

const button = tv({
  base: 'button-like',
  variants: {
    color: {
      primary: 'bg-[--color-primary]',
      secondary:
        'bg-[--color-bg-alternative] text-[--color-text-alternative] fill-[--color-text-alternative] hover:text-[--color-text] hover:fill-[--color-text] active:text-[--color-text] active:fill-[--color-text]',
      danger: 'bg-[--color-danger]',
      selected: 'bg-[--color-selected]',
      transparent: 'bg-transparent text-inherit fill-inherit p-0 hover:underline',
    },
    tag: {
      true: 'rounded-full text-xs',
    },
  },
  compoundVariants: [
    {
      color: ['primary', 'secondary'],
      class: 'hover:bg-[--color-primary-hover] active:bg-[--color-primary-active]',
    },
    {
      color: ['primary', 'danger', 'selected'],
      class: 'text-[--color-text] fill-[--color-text]',
    },
    {
      color: ['danger', 'selected'],
      class: 'hover:bg-[--color-danger-hover] active:bg-[--color-danger-active]',
    },
  ],
  defaultVariants: {
    color: 'primary',
    tag: false,
  },
});

export type ButtonVariants = VariantProps<typeof button>;
const props = defineProps<{
  color?: ButtonVariants['color'];
  tag?: ButtonVariants['tag'];
  icon?: IconString;
}>();
</script>
<template>
  <button :class="button(props)" type="button">
    <IconComponent v-if="icon" :icon="icon" />
    <slot />
  </button>
</template>
