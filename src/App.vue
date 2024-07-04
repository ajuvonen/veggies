<script setup lang="ts">
import {RouterView} from 'vue-router';
import {useActivityStore} from '@/stores/activityStore';
import {storeToRefs} from 'pinia';
import NavBar from '@/components/NavBar.vue';

const {settings} = storeToRefs(useActivityStore());
</script>

<template>
  <div class="app">
    <NavBar v-if="settings.startDate" />
    <RouterView />
  </div>
</template>

<style scoped>
.app {
  @apply h-screen p-4 overflow-hidden;
  @apply flex flex-col items-center justify-center;
  @apply bg-gradient-to-b from-sky-500 to-sky-800 to-80% text-white;
}
</style>
