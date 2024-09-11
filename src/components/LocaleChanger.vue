<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {RadioGroup, RadioGroupLabel, RadioGroupOption} from '@headlessui/vue';
import {useAppStateStore} from '@/stores/appStateStore';

const {settings} = storeToRefs(useAppStateStore());
</script>
<template>
  <RadioGroup v-model="settings.locale">
    <div class="flex-container flex-col">
      <RadioGroupLabel class="label-like">{{ $t('settings.locale') }}</RadioGroupLabel>
      <RadioGroupOption
        v-for="locale in $i18n.availableLocales"
        :key="locale"
        :value="locale"
        v-slot="{checked}"
        class="locale-changer__option"
      >
        <IconComponent :icon="checked ? 'radioboxMarked' : 'radioboxBlank'" />
        <RadioGroupLabel as="p">
          {{ $t(`locales.${locale}`) }}
        </RadioGroupLabel>
      </RadioGroupOption>
    </div>
  </RadioGroup>
</template>
<style lang="scss" scoped>
.locale-changer__option {
  letter-spacing: 1px;
  @apply cursor-pointer button-like;
  @apply flex-container;
  @apply bg-sky-500;

  &:hover,
  &:focus {
    @apply bg-sky-600;
  }
}
</style>
