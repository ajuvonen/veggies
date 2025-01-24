<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {RadioGroup, RadioGroupLabel, RadioGroupOption} from '@headlessui/vue';
import {useAppStateStore} from '@/stores/appStateStore';

const {settings} = storeToRefs(useAppStateStore());
</script>
<template>
  <RadioGroup v-model="settings.locale">
    <ContentElement :title="$t('settings.locale')" :labelTag="RadioGroupLabel">
      <RadioGroupOption
        v-for="locale in $i18n.availableLocales"
        :key="locale"
        :value="locale"
        :data-test-id="`locale-button-${locale}`"
        v-slot="{checked}"
        class="locale-changer__option"
      >
        <IconComponent :icon="checked ? 'radioboxMarked' : 'radioboxBlank'" />
        <RadioGroupLabel as="span">
          {{ $t(`locales.${locale}`) }}
        </RadioGroupLabel>
      </RadioGroupOption>
    </ContentElement>
  </RadioGroup>
</template>
<style scoped>
.locale-changer__option {
  @apply button-like;
  @apply flex-container;
  @apply bg-sky-500;

  &:hover,
  &:focus {
    @apply bg-sky-600;
  }
}
</style>
