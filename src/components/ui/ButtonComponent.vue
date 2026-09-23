<script setup lang="ts">
import {tv, type VariantProps} from 'tailwind-variants/lite';
import type {IconString} from '@/components/ui/IconComponent.vue';

const button = tv({
  base: 'button-like',
  variants: {
    color: {
      primary: 'bg-primary',
      secondary: 'bg-surface text-fg-inverse fill-fg-inverse',
      danger: 'bg-danger',
      selected: 'bg-selected',
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
      class: 'hover:bg-primary-hover active:bg-primary-active',
    },
    {
      color: ['primary', 'danger', 'selected'],
      class: 'text-fg fill-fg',
    },
    {
      color: ['danger', 'selected'],
      disabled: false,
      class: 'hover:bg-danger-hover active:bg-danger-active',
    },
    {
      color: 'secondary',
      disabled: false,
      class: 'hover:text-fg hover:fill-fg active:text-fg active:fill-fg',
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
