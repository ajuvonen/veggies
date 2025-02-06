<script lang="ts" setup>
import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/vue';
import IconComponent from '@/components/IconComponent.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import {BLUESKY_URL} from '@/utils/constants';

const questionKeysAndLinks = {
  appPurpose: '',
  studyDetails: 'https://doi.org/10.1128/msystems.00031-18',
  whatCounts: '',
  categories: '',
  isItFree: '',
  isMyDataSafe: '',
  howToInstall: '',
  contact: BLUESKY_URL,
} as const;
</script>
<template>
  <ContentElement :title="$t('qa.title')" class="min-h-0" labelTag="label">
    <div class="flex-container flex-col has-scroll">
      <Disclosure
        v-for="[key, url] in Object.entries(questionKeysAndLinks)"
        :key="key"
        v-slot="{open}"
      >
        <DisclosureButton
          :as="ButtonComponent"
          :data-test-id="`qa-button-${key}`"
          class="w-full justify-between"
        >
          {{ $t(`qa.${key}.title`) }}
          <IconComponent :class="open ? 'rotate-180 transform' : ''" icon="chevron" />
        </DisclosureButton>
        <Transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="h-0 opacity-0"
          enter-to-class="h-full opacity-100"
          leave-active-class="transition duration-75 ease-out"
          leave-from-class="h-full opacity-100"
          leave-to-class="h-0 opacity-0"
        >
          <DisclosurePanel class="p-2" :data-test-id="`qa-panel-${key}`">
            <i18n-t :keypath="`qa.${key}.text`" tag="div" scope="global">
              <a v-if="url" :href="url" class="text-link" target="_blank" noreferrer noopener>{{
                $t(`qa.${key}.linkText`)
              }}</a>
            </i18n-t>
          </DisclosurePanel>
        </Transition>
      </Disclosure>
    </div>
  </ContentElement>
</template>
