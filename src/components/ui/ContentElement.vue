<script lang="ts" setup>
import type {Component, LabelHTMLAttributes} from 'vue';

withDefaults(
  defineProps<{
    label: string;
    inline?: boolean;
    labelAttrs?: LabelHTMLAttributes;
    labelTag?: Component | keyof HTMLElementTagNameMap;
  }>(),
  {
    inline: false,
    labelAttrs: () => ({}),
    labelTag: 'h2',
  },
);
</script>
<template>
  <div :class="inline ? 'items-center justify-between' : 'flex-col'" class="cluster">
    <component :is="labelTag" class="label-like" v-bind="labelAttrs">{{ label }}</component>
    <slot />
  </div>
</template>
