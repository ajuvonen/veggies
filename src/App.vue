<script setup lang="ts">
import {watch, watchEffect} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {RouterView, useRoute} from 'vue-router';
import {useRegisterSW} from 'virtual:pwa-register/vue';
import {usePreferredDark} from '@vueuse/core';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import {LOCALES} from '@/utils/constants';
import NavBar from '@/components/NavBar.vue';
import ToastContainer from '@/components/ToastContainer.vue';
import AchievementDialog from '@/components/AchievementDialog.vue';
import WeekStartDialog from '@/components/WeekStartDialog.vue';

const {t, locale, setLocaleMessage} = useI18n();

const route = useRoute();

const isDark = usePreferredDark();

const {settings} = storeToRefs(useAppStateStore());
const {allVeggies} = storeToRefs(useActivityStore());

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

watchEffect(async () => {
  if (LOCALES.includes(settings.value.locale)) {
    const {default: messages} = await import(`./i18n/${settings.value.locale}.json`);
    setLocaleMessage(settings.value.locale, messages);
    locale.value = settings.value.locale;
    document.documentElement.setAttribute('lang', settings.value.locale);
  }
});

watchEffect(() => {
  if (route.name) {
    document.title = t('general.appTitleAppend', [t(`views.${route.name.toString()}`)]);
  }
});

watch(
  isDark,
  () => {
    try {
      const highlightColor = getComputedStyle(document.documentElement).getPropertyValue(
        '--color-theme',
      );
      document.querySelector('[name="theme-color"]')?.setAttribute('content', highlightColor);
    } catch (e) {
      console.error(e);
    }
  },
  {immediate: true},
);
</script>

<template>
  <ToastContainer />
  <NavBar :showStats="!!allVeggies.length" />
  <main>
    <RouterView />
  </main>
  <AchievementDialog />
  <WeekStartDialog />
</template>

<style scoped>
main {
  @apply h-full min-h-0;
  @apply flex flex-col items-center gap-6;
  > * {
    @apply w-full max-w-xl;
  }
}
</style>
