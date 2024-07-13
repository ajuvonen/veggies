<script setup lang="ts">
import {watch} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n, type Locale} from 'vue-i18n';
import {RouterView, useRoute} from 'vue-router';
import {useActivityStore} from '@/stores/activityStore';
import NavBar from '@/components/NavBar.vue';

const {t, locale} = useI18n();

const route = useRoute();

const {settings} = storeToRefs(useActivityStore());

watch(
  () => settings.value.locale,
  (newLocale: Locale) => {
    locale.value = newLocale;
  },
  {immediate: true},
);

watch(
  () => [locale.value, route.name],
  ([_, newName]) => {
    document.title = t('general.appTitleAppend', [t(`views.${newName?.toString()}`)]);
  },
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
  @apply flex flex-col items-center justify-start gap-8;
  @apply bg-gradient-to-b from-sky-500 to-sky-800 to-80% text-white fill-white;
}
</style>
