<script setup lang="ts" generic="T extends string | number">
const model = defineModel<T>({required: true});
withDefaults(defineProps<{
  options: {value: T; label: string}[];
  title: string;
  prefix?: string;
}>(), {
  prefix: () => crypto.randomUUID(),
});
</script>
<template>
  <RadioGroupRoot v-model="model" asChild>
    <ContentElement
      :title="title"
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
