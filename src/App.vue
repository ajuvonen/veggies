<script setup lang="ts">
import {watch} from 'vue';
import {useI18n, type Locale} from 'vue-i18n';
import {RouterView} from 'vue-router';
import {useActivityStore} from '@/stores/activityStore';
import {storeToRefs} from 'pinia';
import NavBar from '@/components/NavBar.vue';

const {locale} = useI18n();

const {settings} = storeToRefs(useActivityStore());

watch(
  () => settings.value.locale,
  (newLocale: Locale) => {
    locale.value = newLocale;
  },
  {immediate: true},
);
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
  @apply flex flex-col items-center justify-center gap-4;
  @apply bg-gradient-to-b from-sky-500 to-sky-800 to-80% text-white;
}
</style>
