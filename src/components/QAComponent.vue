<script lang="ts" setup>
import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/vue';
import IconComponent from '@/components/IconComponent.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';

const questions = [
  'appPurpose',
  'studyDetails',
  'whatCounts',
  'categories',
  'isItFree',
  'isMyDataSafe',
  'contact',
];

const keysWithLinks = ['contact', 'studyDetails'];
</script>
<template>
  <ContentElement :title="$t('qa.title')" class="min-h-0" labelTag="label">
    <div class="flex-container flex-col has-scroll">
      <Disclosure v-for="key in questions" :key="key" v-slot="{open}">
        <DisclosureButton
          :as="ButtonComponent"
          :data-test-id="`qa-button-${key}`"
          class="w-full justify-between"
        >
          {{ $t(`qa.${key}.title`) }}
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
          <DisclosurePanel class="p-2" :data-test-id="`qa-panel-${key}`">
            <i18n-t :keypath="`qa.${key}.text`" tag="div" scope="global">
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
  </ContentElement>
</template>
