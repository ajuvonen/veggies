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
@reference '@/assets/main.css';

input {
  @apply appearance-none h-4 rounded-md outline-offset-4;
  @apply bg-surface-dark;
}

input::-webkit-slider-thumb {
  appearance: none;
  border-style: none;
  border-radius: var(--radius-md);
  width: calc(var(--spacing) * 6);
  height: calc(var(--spacing) * 6);
  cursor: pointer;
  background-color: var(--color-primary);
}

input::-webkit-slider-thumb:hover {
  background-color: var(--color-primary-hover);
}

input::-webkit-slider-thumb:active {
  background-color: var(--color-primary-active);
}

input::-moz-range-thumb {
  appearance: none;
  border-style: none;
  border-radius: var(--radius-md);
  width: calc(var(--spacing) * 6);
  height: calc(var(--spacing) * 6);
  cursor: pointer;
  background-color: var(--color-primary);
}

input::-moz-range-thumb:hover {
  background-color: var(--color-primary-hover);
}

input::-moz-range-thumb:active {
  background-color: var(--color-primary-active);
}
</style>
