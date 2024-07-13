<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {RadioGroup, RadioGroupLabel, RadioGroupOption} from '@headlessui/vue';
import {useActivityStore} from '@/stores/activityStore';

const {settings} = storeToRefs(useActivityStore());
</script>
<template>
  <RadioGroup v-model="settings.locale" class="mx-auto w-full max-w-sm text-sm uppercase">
    <div class="locale-changer__container">
      <RadioGroupLabel>{{ $t('settings.locale') }}</RadioGroupLabel>
      <RadioGroupOption
        v-for="locale in $i18n.availableLocales"
        :key="locale"
        :value="locale"
        v-slot="{checked}"
        class="locale-changer__option"
      >
        <IconComponent :icon="checked ? 'radioboxMarked' : 'radioboxBlank'" />
        <RadioGroupLabel as="p" class="text-sm">
          {{ $t(`locales.${locale}`) }}
        </RadioGroupLabel>
      </RadioGroupOption>
    </div>
  </RadioGroup>
</template>
<style lang="scss" scoped>
.locale-changer__container {
  @apply flex flex-col gap-2;
}

.locale-changer__option {
  letter-spacing: 1px;
  @apply flex gap-2;
  @apply cursor-pointer rounded-md px-4 py-2;
  @apply bg-sky-500;

  &:hover,
  &:focus {
    @apply bg-sky-600;
  }
}
</style>
