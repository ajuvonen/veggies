<script setup lang="ts">
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
  <SwitchRoot v-model="model" :disabled="disabled" class="toggle-button">
    <SwitchThumb class="toggle-button__thumb">
      <IconComponent :icon="model ? 'check' : 'close'" />
    </SwitchThumb>
  </SwitchRoot>
</template>
<style>
.toggle-button {
  @apply relative inline-flex h-4 w-12 items-center rounded-md outline-offset-4;
  @apply bg-[--color-ui-dark];

  &[disabled] {
    @apply opacity-50 cursor-not-allowed;
  }

  > .toggle-button__thumb {
    @apply inline-block w-6 h-6 transform rounded-md shadow-lg transition-transform duration-200;
    @apply flex items-center justify-center;
    @apply bg-[--color-bg-alternative] fill-[--color-text-alternative];

    [data-state='checked']& {
      @apply translate-x-6;
      @apply bg-[--color-primary] fill-[--color-text];
    }
    :not([disabled])& {
      @apply hover:bg-[--color-primary-hover] hover:fill-[--color-text] active:bg-[--color-primary-active] active:fill-[--color-text];
    }
  }
}
</style>
