<script setup lang="ts">
import {watchEffect} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {useRoute} from 'vue-router';
import {useRegisterSW} from 'virtual:pwa-register/vue';
import {onKeyStroke, useEventListener} from '@vueuse/core';
import {useAppStateStore} from '@/stores/appStateStore';
import {useCssColors} from '@/hooks/cssColors';
import {LOCALES} from '@/utils/constants';

const {t, locale, setLocaleMessage} = useI18n();

const route = useRoute();

const [themeColor] = useCssColors(['--color-theme']);

useEventListener('touchstart', () => document.body.setAttribute('data-input', 'touch'), {
  passive: true,
});
useEventListener('mousedown', () => document.body.setAttribute('data-input', 'mouse'));
onKeyStroke(true, () => document.body.setAttribute('data-input', 'keyboard'), {dedupe: true});

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

watchEffect(() => {
  document.querySelector('[name="theme-color"]')?.setAttribute('content', themeColor.value);
});
</script>

<template>
  <ToastContainer />
  <NavBar />
  <main>
    <RouterView />
  </main>
  <AchievementDialog />
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
