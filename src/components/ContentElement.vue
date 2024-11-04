<script lang="ts" setup>
withDefaults(
  defineProps<{
    title: string;
    ariaHidden?: boolean;
  }>(),
  {
    ariaHidden: false,
  },
);
</script>
<template>
  <div class="flex-container flex-col">
    <h1 class="label-like" :aria-hidden="ariaHidden">{{ title }}</h1>
    <slot />
  </div>
</template>
