<script setup lang="ts">
import {ref, watch, watchEffect} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {RouterView, useRoute} from 'vue-router';
import {useRegisterSW} from 'virtual:pwa-register/vue';
import {omitBy} from 'remeda';
import confetti from 'canvas-confetti';
import {usePreferredDark} from '@vueuse/core';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import {AchievementLevel, type Achievements} from '@/utils/types';
import AchievementBadge from '@/components/AchievementBadge.vue';
import ModalDialog from '@/components/ModalDialog.vue';
import NavBar from '@/components/NavBar.vue';
import ToastContainer from '@/components/ToastContainer.vue';

const {t, locale} = useI18n();

const route = useRoute();

const isDark = usePreferredDark();

const {settings} = storeToRefs(useAppStateStore());
const {allVeggies, achievements} = storeToRefs(useActivityStore());

const newAchievements = ref({} as Partial<Achievements>);

const dialogOpen = ref(false);

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
  document.documentElement.setAttribute('lang', settings.value.locale);
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

watch(achievements, (newValue, oldValue) => {
  newAchievements.value = omitBy(
    newValue,
    (value, key) => value === AchievementLevel.NoAchievement || oldValue[key] >= value,
  );
  if (Object.keys(newAchievements.value).length) {
    dialogOpen.value = true;
    confetti({
      disableForReducedMotion: true,
      particleCount: 150,
      spread: 70,
      origin: {x: 0.5, y: 0.7},
    });
  }
});
</script>

<template>
  <ToastContainer />
  <NavBar :showStats="!!allVeggies.length" />
  <main>
    <RouterView />
  </main>
  <ModalDialog v-model="dialogOpen" :title="$t('achievements.newAchievements')">
    <template #content>
      <ul class="achievement-container">
        <li v-for="(value, key) in newAchievements" :key="key" class="flex-container flex-col">
          <AchievementBadge active :achievement="key" :level="value!" />
          <p class="text-center">{{ t(`achievements.${key}.${value}`) }}</p>
        </li>
      </ul>
    </template>
  </ModalDialog>
</template>

<style scoped>
main {
  @apply h-full min-h-0;
  @apply flex flex-col items-center gap-6;
  > * {
    @apply w-full max-w-xl;
  }
}

.achievement-container {
  @apply flex-container gap-4 flex-col;
  @apply text-sm;
}
</style>
