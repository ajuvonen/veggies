<script lang="ts" setup>
import {getRandomEmojis} from '@/utils/helpers';
</script>
<template>
  <div class="flex justify-center items-center h-full">
    <div class="spinner">{{ getRandomEmojis()[0] }}</div>
  </div>
</template>
<style scoped>
.spinner {
  font-size: 3rem;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
