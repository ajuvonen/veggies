<script setup lang="ts">
import {Switch} from '@headlessui/vue';
const model = defineModel<boolean>({required: true});
withDefaults(
  defineProps<{
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  },
);
</script>
<template>
  <Switch v-model="model" :disabled="disabled" class="toggle-button">
    <div>
      <IconComponent :icon="model ? 'check' : 'close'" />
    </div>
  </Switch>
</template>
<style>
.toggle-button {
  @apply relative inline-flex h-4 w-12 items-center rounded-md outline-offset-4;
  @apply bg-[--color-ui-dark];

  &[disabled] {
    @apply opacity-50 cursor-not-allowed pointer-events-none;
  }

  > div {
    @apply inline-block w-6 h-6 transform rounded-md transition-transform;
    @apply flex items-center justify-center;
    @apply bg-[--color-bg-alternative] fill-[--color-text-alternative] active:bg-[--color-primary-active] hover:bg-[--color-primary-hover] hover:fill-[--color-text];
  }

  &[data-headlessui-state='checked'] > div {
    @apply translate-x-6;
    @apply bg-[--color-primary] fill-[--color-text] active:bg-[--color-primary-active] hover:bg-[--color-primary-hover];
  }
}
</style>
