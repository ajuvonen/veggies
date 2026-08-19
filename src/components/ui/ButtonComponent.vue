<script setup lang="ts">
import {tv, type VariantProps} from 'tailwind-variants/lite';
import type {IconString} from '@/components/ui/IconComponent.vue';

const button = tv({
  base: 'button-like',
  variants: {
    color: {
      primary: 'bg-[--color-primary]',
      secondary:
        'bg-[--color-bg-alternative] text-[--color-text-alternative] fill-[--color-text-alternative]',
      danger: 'bg-[--color-danger]',
      selected: 'bg-[--color-selected]',
      transparent: 'bg-transparent text-inherit fill-inherit p-0',
    },
    tag: {
      true: 'rounded-full text-xs',
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed',
    },
  },
  compoundVariants: [
    {
      color: ['primary', 'secondary'],
      disabled: false,
      class: 'hover:bg-[--color-primary-hover] active:bg-[--color-primary-active]',
    },
    {
      color: ['primary', 'danger', 'selected'],
      class: 'text-[--color-text] fill-[--color-text]',
    },
    {
      color: ['danger', 'selected'],
      disabled: false,
      class: 'hover:bg-[--color-danger-hover] active:bg-[--color-danger-active]',
    },
    {
      color: 'secondary',
      disabled: false,
      class:
        'hover:text-[--color-text] hover:fill-[--color-text] active:text-[--color-text] active:fill-[--color-text]',
    },
    {
      color: 'transparent',
      disabled: false,
      class: 'hover:underline',
    },
  ],
  defaultVariants: {
    color: 'primary',
    tag: false,
    disabled: false,
  },
});

export type ButtonVariants = VariantProps<typeof button>;
const props = defineProps<{
  color?: ButtonVariants['color'];
  tag?: ButtonVariants['tag'];
  icon?: IconString;
  disabled?: boolean;
}>();

const guardClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
};
</script>
<template>
  <button
    :class="button(props)"
    :aria-disabled="disabled || undefined"
    type="button"
    @click="guardClick"
  >
    <IconComponent v-if="icon" :icon="icon" />
    <slot />
  </button>
</template>
