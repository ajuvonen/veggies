<script lang="ts" setup>
import {BLUESKY_URL, PLAY_STORE_URL} from '@/utils/constants';

const questionKeysAndLinks = {
  appPurpose: '',
  howToInstall: PLAY_STORE_URL,
  studyDetails: 'https://doi.org/10.1128/msystems.00031-18',
  whatCounts: '',
  categories: '',
  isItFree: '',
  isMyDataSafe: '',
  contact: BLUESKY_URL,
} as const;
</script>
<template>
  <AccordionRoot asChild :collapsible="true" type="multiple">
    <ContentElement :title="$t('qa.title')">
      <AccordionItem
        v-for="[key, url] in Object.entries(questionKeysAndLinks)"
        :key="key"
        :value="key"
        v-slot="{open}"
      >
        <AccordionHeader>
          <AccordionTrigger asChild>
            <ButtonComponent :data-test-id="`qa-button-${key}`" class="w-full justify-between">
              {{ $t(`qa.${key}.title`) }}
              <IconComponent
                :class="{'rotate-180': open}"
                class="transition duration-200"
                icon="chevronDown"
              />
            </ButtonComponent>
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent class="collapsible-content" :data-test-id="`qa-panel-${key}`">
          <i18n-t
            :keypath="`qa.${key}.text`"
            tag="div"
            scope="global"
            class="whitespace-pre-line p-2"
          >
            <a v-if="url" :href="url" class="text-link" target="_blank" rel="noopener noreferrer">{{
              $t(`qa.${key}.linkText`)
            }}</a>
          </i18n-t>
        </AccordionContent>
      </AccordionItem>
    </ContentElement>
  </AccordionRoot>
</template>
<style scoped>
.collapsible-content {
  @apply overflow-hidden;
  &[data-state='open'] {
    animation: slideDown 200ms ease-in-out;
  }
  &[data-state='closed'] {
    animation: slideUp 200ms ease-in-out;
  }
}

@keyframes slideDown {
  from {
    height: 0;
  }
  to {
    height: var(--reka-collapsible-content-height);
  }
}

@keyframes slideUp {
  from {
    height: var(--reka-collapsible-content-height);
  }
  to {
    height: 0;
  }
}
</style>
