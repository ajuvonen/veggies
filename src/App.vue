<script setup lang="ts">
import {watch} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {RouterView, useRoute} from 'vue-router';
import {useActivityStore} from '@/stores/activityStore';
import NavBar from '@/components/NavBar.vue';
import ToastContainer from '@/components/ToastContainer.vue';

const {t, locale} = useI18n();

const route = useRoute();

const {settings, allVeggies} = storeToRefs(useActivityStore());

watch(
  () => settings.value.locale,
  (newLocale) => {
    locale.value = newLocale;
  },
  {immediate: true},
);

watch(
  () => [locale.value, route.name],
  ([, newName]) => {
    document.title = t('general.appTitleAppend', [t(`views.${newName?.toString()}`)]);
  },
);
</script>

<template>
  <div class="app__container">
    <ToastContainer />
    <NavBar v-if="settings.startDate" :showStats="!!allVeggies.length" />
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
.app__container {
  @apply h-screen p-4 overflow-hidden relative;
  @apply flex flex-col items-center gap-8;
  @apply bg-gradient-to-b from-sky-600 to-sky-800 to-80%;
  > *:not(nav, .toast-container) {
    @apply w-full max-w-xl;
  }
}
</style>
