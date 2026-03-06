<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {RadioGroupItem, RadioGroupRoot} from 'reka-ui';
import {useAppStateStore} from '@/stores/appStateStore';
import {LOCALES} from '@/utils/constants';

const {settings} = storeToRefs(useAppStateStore());
</script>
<template>
  <RadioGroupRoot v-model="settings.locale" asChild>
    <ContentElement
      :title="$t('settings.locale')"
      :labelAttrs="{id: 'locale-changer-title'}"
      labelTag="h2"
      aria-labelledby="locale-changer-title"
    >
      <RadioGroupItem v-for="locale in LOCALES" :key="locale" :value="locale" asChild>
        <ButtonComponent
          :icon="settings.locale === locale ? 'radioboxMarked' : 'radioboxBlank'"
          :data-test-id="`locale-button-${locale}`"
        >
          {{ $t(`locales.${locale}`) }}
        </ButtonComponent>
      </RadioGroupItem>
    </ContentElement>
  </RadioGroupRoot>
</template>
