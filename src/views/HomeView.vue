<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import {storeToRefs} from 'pinia';
import {DateTime} from 'luxon';
import {usePreferredLanguages} from '@vueuse/core';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import {DEFAULT_LOCALE, LOCALES} from '@/utils/constants';
import type {Locale} from '@/utils/types';
import ModalDialog from '@/components/ModalDialog.vue';
import FooterComponent from '@/components/FooterComponent.vue';

const router = useRouter();
const preferredLanguages = usePreferredLanguages();

const {startDate} = storeToRefs(useActivityStore());
const {settings} = storeToRefs(useAppStateStore());

const dialogOpen = ref(false);

const start = () => {
  startDate.value = DateTime.now().startOf('week');
  router.replace({name: 'log'});
};

onMounted(() => {
  const startupLocale =
    preferredLanguages.value
      .map((language) => language.split('-')[0] as string)
      .find((language: string): language is Locale => LOCALES.includes(language as Locale)) ||
    DEFAULT_LOCALE;
  settings.value.locale = startupLocale;
});
</script>
<template>
  <div class="home__container">
    <h1 class="home__title">{{ $t('general.appTitle') }}</h1>
    <p class="sm:text-center">
      {{ $t('home.callout') }}
    </p>
    <div class="flex-container justify-center">
      <ButtonComponent data-test-id="home-start-button" @click="start()">{{
        $t('general.start')
      }}</ButtonComponent>
      <ButtonComponent
        variant="secondary"
        data-test-id="home-info-button"
        @click="dialogOpen = true"
        >{{ $t('home.info') }}</ButtonComponent
      >
    </div>
    <FooterComponent />
    <ModalDialog v-model="dialogOpen" :title="$t('home.infoTitle')">
      <template #content>
        <p>{{ $t('home.infoP1') }}</p>
        <p>{{ $t('home.infoP2') }}</p>
        <p>{{ $t('home.infoP3') }}</p>
      </template>
    </ModalDialog>
  </div>
</template>
<style scoped>
.home__container {
  @apply flex flex-col gap-6 items-center justify-center;
  @apply h-full;
}

.home__title {
  font-family: 'Bungee Shade', system-ui;
  font-size: 16vw;
  @apply sm:text-7xl sm:text-center uppercase;
}
</style>
