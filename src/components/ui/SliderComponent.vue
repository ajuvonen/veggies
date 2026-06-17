<script setup lang="ts">
import {computed, useAttrs} from 'vue';

defineOptions({inheritAttrs: false});

defineProps<{
  label: string;
  min: number;
  max: number;
  step: number;
}>();

const model = defineModel<number>({required: true});
const attrs = useAttrs();
const prefix = computed(() => (attrs.id as string | undefined) ?? crypto.randomUUID());
</script>
<template>
  <ContentElement :label :labelAttrs="{for: prefix}" labelTag="label">
    <input v-model.number="model" :id="prefix" type="range" :min :max :step />
    <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
    <output :for="prefix">{{ model }}</output>
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
