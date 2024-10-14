<script setup lang="ts">
import {watchEffect} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {RouterView, useRoute} from 'vue-router';
import {useRegisterSW} from 'virtual:pwa-register/vue';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import NavBar from '@/components/NavBar.vue';
import ToastContainer from '@/components/ToastContainer.vue';

const {t, locale} = useI18n();

const route = useRoute();

const {allVeggies} = storeToRefs(useActivityStore());
const {settings} = storeToRefs(useAppStateStore());

const {updateServiceWorker} = useRegisterSW({
  immediate: true,
  onRegisteredSW(_, registration) {
    if (registration) {
      setInterval(() => {
        registration.update();
      }, 60 * 1000);
    }
  },
  onNeedRefresh() {
    updateServiceWorker();
  },
});

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
  <ToastContainer />
  <NavBar v-if="route.name !== 'home'" :showStats="!!allVeggies.length" />
  <main>
    <RouterView />
  </main>
</template>

<style lang="scss" scoped>
main {
  @apply h-full min-h-0;
  @apply flex flex-col items-center gap-6;
  > * {
    @apply w-full max-w-xl;
  }
}
</style>
