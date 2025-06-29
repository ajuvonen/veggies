<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {RadioGroup, RadioGroupLabel, RadioGroupOption} from '@headlessui/vue';
import {useAppStateStore} from '@/stores/appStateStore';
import {LOCALES} from '@/utils/constants';

const {settings} = storeToRefs(useAppStateStore());
</script>
<template>
  <RadioGroup v-model="settings.locale">
    <ContentElement :title="$t('settings.locale')" :labelTag="RadioGroupLabel">
      <RadioGroupOption
        v-for="locale in LOCALES"
        as="template"
        :key="locale"
        :value="locale"
        v-slot="{checked}"
      >
        <ButtonComponent
          :icon="checked ? 'radioboxMarked' : 'radioboxBlank'"
          :data-test-id="`locale-button-${locale}`"
        >
          <RadioGroupLabel as="span"> {{ $t(`locales.${locale}`) }}</RadioGroupLabel>
        </ButtonComponent>
      </RadioGroupOption>
    </ContentElement>
  </RadioGroup>
</template>
