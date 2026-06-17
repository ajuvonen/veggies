<script setup lang="ts">
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {useAppStateStore} from '@/stores/appStateStore';
import {LOCALES} from '@/utils/constants';

const {settings} = storeToRefs(useAppStateStore());
const {t} = useI18n();

const options = computed(() =>
  LOCALES.map((locale) => ({value: locale, label: t(`locales.${locale}`)})),
);
</script>
<template>
  <RadioGroupComponent
    v-model="settings.locale"
    :label="$t('settings.locale')"
    :options="options"
    prefix="locales"
  />
</template>
