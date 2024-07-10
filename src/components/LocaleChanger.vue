<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {RadioGroup, RadioGroupLabel, RadioGroupOption} from '@headlessui/vue';
import IconComponent from '@/components/IconComponent.vue';
import {useActivityStore} from '@/stores/activityStore';

const {settings} = storeToRefs(useActivityStore());
</script>
<template>
  <RadioGroup v-model="settings.locale" class="mx-auto w-full max-w-sm text-sm uppercase">
    <div class="flex flex-col gap-2">
      <RadioGroupLabel>{{ $t('settings.locale') }}</RadioGroupLabel>
      <RadioGroupOption
        as="template"
        v-for="locale in $i18n.availableLocales"
        :key="locale"
        :value="locale"
        v-slot="{checked}"
      >
        <div class="flex gap-2 cursor-pointer rounded-md px-4 py-2 bg-sky-500 fill-white">
          <IconComponent :icon="checked ? 'radioboxMarked' : 'radioboxBlank'" />
          <RadioGroupLabel as="p" class="text-sm">
            {{ $t(`locales.${locale}`) }}
          </RadioGroupLabel>
        </div>
      </RadioGroupOption>
    </div>
  </RadioGroup>
</template>
<style lang="scss" scoped></style>
