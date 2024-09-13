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
  <div class="locale-changer__container">
    <IconComponent icon="earth" />
    <ButtonComponent
      v-for="availableLocale in availableLocales"
      :key="availableLocale"
      :data-test-id="`home-locale-button-${availableLocale}`"
      variant="text"
      @click="settings.locale = availableLocale"
      >{{ availableLocale }}</ButtonComponent
    >
  </div>
</template>
<style lang="scss" scoped>
.locale-changer__container {
  @apply absolute top-4 right-4;
  @apply flex-container;
}
</style>
