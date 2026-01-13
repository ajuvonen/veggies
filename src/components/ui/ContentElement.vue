<script lang="ts" setup>
import type {Component, HTMLAttributes} from 'vue';

withDefaults(
  defineProps<{
    title: string;
    labelAttrs?: HTMLAttributes;
    labelTag?: Component | keyof HTMLElementTagNameMap;
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
