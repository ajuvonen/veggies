<script setup lang="ts">
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {storeToRefs} from 'pinia';
import {LOCALES} from '@/utils/constants';
import {useAppStateStore} from '@/stores/appStateStore';

const {settings} = storeToRefs(useAppStateStore());
const {locale} = useI18n();

const availableLocales = computed(() =>
  LOCALES.filter((availableLocale) => availableLocale !== locale.value),
);
</script>
<template>
  <div class="flex-container">
    <IconComponent icon="earth" />
    <ButtonComponent
      v-for="availableLocale in availableLocales"
      :key="availableLocale"
      :data-test-id="`home-locale-button-${availableLocale}`"
      :aria-label="$t('home.changeLocale', [$t(`locales.${availableLocale}`)])"
      variant="text"
      @click="settings.locale = availableLocale"
      >{{ availableLocale }}</ButtonComponent
    >
  </div>
</template>
