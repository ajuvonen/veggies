<script setup lang="ts">
defineEmits(['click']);
</script>
<template>
  <button @click="$emit('click')">
    <slot></slot>
  </button>
</template>
<style scoped lang="scss">
button {
  @apply px-4 py-2 text-white uppercase;
  @apply bg-sky-400 rounded-md;

  &:hover {
    @apply bg-sky-500;
  }
}
</style>
