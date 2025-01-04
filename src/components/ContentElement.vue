<script lang="ts" setup>
withDefaults(
  defineProps<{
    title: string;
    labelAttrs?: Record<string, string | number | boolean>;
    labelTag?: ObjectConstructor | string;
  }>(),
  {
    labelAttrs: () => ({}),
    labelTag: 'h2',
  },
);
</script>
<template>
  <div class="flex-container flex-col">
    <component :is="labelTag" class="label-like" v-bind="labelAttrs">{{ title }}</component>
    <slot />
  </div>
</template>
