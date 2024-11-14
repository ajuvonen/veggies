<script lang="ts" setup>
withDefaults(
  defineProps<{
    title: string;
    containerAttrs?: Record<string, string | number | boolean>;
    labelAttrs?: Record<string, string | number | boolean>;
    labelTag?: 'h2' | 'label';
  }>(),
  {
    containerAttrs: () => ({}),
    labelAttrs: () => ({}),
    labelTag: 'h2',
  },
);
</script>
<template>
  <div class="flex-container flex-col" v-bind="containerAttrs">
    <component :is="labelTag" class="label-like" v-bind="labelAttrs">{{ title }}</component>
    <slot />
  </div>
</template>
