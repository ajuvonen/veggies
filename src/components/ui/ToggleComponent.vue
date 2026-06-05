<script setup lang="ts">
import {tv} from 'tailwind-variants/lite';

const model = defineModel<boolean>({required: true});
const props = defineProps<{disabled?: boolean}>();

const toggle = tv({
  slots: {
    root: 'relative inline-flex h-4 w-12 items-center rounded-md outline-offset-4 bg-[--color-ui-dark]',
    thumb: [
      'inline-flex w-6 h-6 items-center justify-center transform rounded-md shadow-lg transition-transform duration-200',
      'bg-[--color-bg-alternative] fill-[--color-text-alternative]',
    ],
  },
  variants: {
    disabled: {
      true: {
        root: 'opacity-50 cursor-not-allowed',
      },
      false: {
        thumb:
          'hover:bg-[--color-primary-hover] hover:fill-[--color-text] active:bg-[--color-primary-active] active:fill-[--color-text]',
      },
    },
    checked: {
      true: {
        thumb: 'translate-x-6 bg-[--color-primary] fill-[--color-text]',
      },
    },
  },
  defaultVariants: {
    disabled: false,
    checked: false,
  },
});

const {root, thumb} = toggle();
</script>
<template>
  <SwitchRoot v-model="model" :disabled="disabled" :class="root({disabled, checked: model})">
    <SwitchThumb :class="thumb({disabled, checked: model})">
      <IconComponent :icon="model ? 'check' : 'close'" />
    </SwitchThumb>
  </SwitchRoot>
</template>
