<script lang="ts" setup>
import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/vue';
import IconComponent from './IconComponent.vue';

const questions = [
  'appPurpose',
  'studyDetails',
  'isItFree',
  'isMyDataSafe',
  'contact',
  'whatCounts',
  'categories',
];

const keysWithLinks = ['contact', 'studyDetails'];
</script>
<template>
  <div class="flex-container flex-col min-h-0">
    <label class="uppercase text-xs">{{ $t('qa.title') }}</label>
    <div class="flex-container flex-col has-scroll">
      <Disclosure v-for="key in questions" :key="key" v-slot="{open}">
        <DisclosureButton class="QA__button">
          <span>{{ $t(`qa.${key}.title`) }}</span>
          <IconComponent :class="open ? 'rotate-180 transform' : ''" icon="chevron" />
        </DisclosureButton>
        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform h-0 opacity-0"
          enter-to-class="transform h-full opacity-100"
          leave-active-class="transition duration-75 ease-out"
          leave-from-class="transform h-full opacity-100"
          leave-to-class="transform h-0 opacity-0"
        >
          <DisclosurePanel class="QA__panel">
            <i18n-t :keypath="`qa.${key}.text`" tag="span" scope="global">
              <a
                v-if="keysWithLinks.includes(key)"
                :href="$t(`qa.${key}.link.url`)"
                target="_blank"
                noreferrer
                noopener
                >{{ $t(`qa.${key}.link.text`) }}</a
              >
            </i18n-t>
          </DisclosurePanel>
        </transition>
      </Disclosure>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.QA__button {
  letter-spacing: 1px;
  @apply w-full cursor-pointer button-like;
  @apply flex-container justify-between;
  @apply bg-sky-500;

  &:hover,
  &:focus {
    @apply bg-sky-600;
  }
}

.QA__panel {
  @apply p-2;
}
</style>
