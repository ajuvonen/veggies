<script lang="ts" setup>
import type {Component, LabelHTMLAttributes} from 'vue';

withDefaults(
  defineProps<{
    title: string;
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
  <div
    :class="{'flex-col': !inline, 'items-center': inline, 'justify-between': inline}"
    class="flex-container"
  >
    <component :is="labelTag" class="label-like" v-bind="labelAttrs">{{ title }}</component>
    <slot />
  </div>
</template>
