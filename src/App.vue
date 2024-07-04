<script setup lang="ts">
import {RouterView} from 'vue-router';
import {useActivityStore} from '@/stores/activityStore';
import {storeToRefs} from 'pinia';
import Welcome from '@/components/Welcome.vue';
import NavBar from '@/components/NavBar.vue';

const {settings} = storeToRefs(useActivityStore());
</script>

<template>
  <div class="app">
    <NavBar v-if="settings.startDate" />
    <Welcome v-if="!settings.startDate" />
    <RouterView v-else />
  </div>
</template>

<style scoped>
.app {
  @apply h-screen p-4 overflow-hidden;
  @apply flex flex-col items-center justify-center;
  @apply bg-gradient-to-b from-sky-500 to-sky-800 to-80% text-white;
}
</style>
