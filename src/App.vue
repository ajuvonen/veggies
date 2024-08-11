<script setup lang="ts">
import {watchEffect} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {RouterView, useRoute} from 'vue-router';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import NavBar from '@/components/NavBar.vue';
import ToastContainer from '@/components/ToastContainer.vue';

const {t, locale} = useI18n();

const route = useRoute();

const {allVeggies} = storeToRefs(useActivityStore());
const {settings} = storeToRefs(useAppStateStore());

watchEffect(() => {
  locale.value = settings.value.locale;
});

watchEffect(() => {
  if (route.name) {
    document.title = t('general.appTitleAppend', [t(`views.${route.name.toString()}`)]);
  }
});
</script>

<template>
  <div class="app__container">
    <ToastContainer />
    <NavBar v-if="route.name !== 'home'" :showStats="!!allVeggies.length" />
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
