<script setup lang="ts">
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {LOCALES} from '@/utils/constants';
import {useAppStateStore} from '@/stores/appStateStore';

const {settings} = storeToRefs(useAppStateStore());

const availableLocales = computed(() =>
  LOCALES.filter((availableLocale) => availableLocale !== settings.value.locale),
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
      color="transparent"
      @click="settings.locale = availableLocale"
      >{{ availableLocale }}</ButtonComponent
    >
  </div>
</template>
