<script setup lang="ts">
const model = defineModel<number>({required: true});
withDefaults(
  defineProps<{
    title: string;
    min: number;
    max: number;
    step: number;
    prefix?: string;
  }>(),
  {
    prefix: () => crypto.randomUUID(),
  },
);
</script>
<template>
  <ContentElement :title="title" :labelAttrs="{for: `${prefix}-input`}" labelTag="label">
    <input
      :id="`${prefix}-input`"
      v-model.number="model"
      type="range"
      :min="min"
      :max="max"
      :step="step"
    />
    <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
    <output :for="`${prefix}-input`">{{ model }}</output>
  </ContentElement>
</template>
<style scoped>
input {
  @apply appearance-none h-4 rounded-md outline-offset-4;
  @apply bg-[--color-ui-dark];

  &::-webkit-slider-thumb {
    @apply appearance-none rounded-md border-none w-6 h-6 cursor-pointer;
    @apply bg-[--color-primary] hover:bg-[--color-primary-hover] active:bg-[--color-primary-active];
  }

  &::-moz-range-thumb {
    @apply appearance-none rounded-md border-none w-6 h-6 cursor-pointer;
    @apply bg-[--color-primary] hover:bg-[--color-primary-hover] active:bg-[--color-primary-active];
  }
}
</style>
