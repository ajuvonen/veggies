<script setup lang="ts" generic="T extends string | number">
import {computed, useAttrs} from 'vue';

defineOptions({inheritAttrs: false});

defineProps<{
  options: {value: T; label: string}[];
  label: string;
}>();

const model = defineModel<T>({required: true});
const attrs = useAttrs();
const prefix = computed(() => (attrs.id as string | undefined) ?? crypto.randomUUID());
</script>
<template>
  <RadioGroupRoot v-model="model" asChild>
    <ContentElement
      :label="label"
      :labelAttrs="{id: `${prefix}-label`}"
      :aria-labelledby="`${prefix}-label`"
      labelTag="label"
    >
      <RadioGroupItem
        v-for="option in options"
        :key="String(option.value)"
        :value="option.value"
        asChild
      >
        <ButtonComponent
          :icon="model === option.value ? 'radioboxMarked' : 'radioboxBlank'"
          :data-test-id="`${prefix}-${option.value}`"
        >
          {{ option.label }}
        </ButtonComponent>
      </RadioGroupItem>
    </ContentElement>
  </RadioGroupRoot>
</template>
