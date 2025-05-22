<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import LocaleChanger from '@/components/LocaleChanger.vue';
import ModalDialog from '@/components/ModalDialog.vue';
import QAComponent from '@/components/QAComponent.vue';
import BuildTime from '@/components/BuildTime.vue';

const router = useRouter();

const {t} = useI18n();

const {$reset: activityReset} = useActivityStore();
const appStateStore = useAppStateStore();
const {settings} = storeToRefs(appStateStore);
const {$reset: appStateReset} = appStateStore;

const resetDialogOpen = ref(false);
const debugCounter = ref(0);

const reset = () => {
  activityReset();
  appStateReset();
  router.push({name: 'home'});
};

const copyData = () => {
  try {
    navigator.clipboard.writeText(
      t('settings.copy.text', [
        localStorage.getItem('veggies-start-date'),
        JSON.stringify(JSON.parse(localStorage.getItem('veggies-weeks') || ''), null, 2),
        JSON.stringify(JSON.parse(localStorage.getItem('veggies-challenges') || ''), null, 2),
        JSON.stringify(JSON.parse(localStorage.getItem('veggies-settings') || ''), null, 2),
      ]),
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    navigator.clipboard.writeText(
      t('settings.copy.text', [
        localStorage.getItem('veggies-start-date'),
        localStorage.getItem('veggies-weeks'),
        localStorage.getItem('veggies-challenges'),
        localStorage.getItem('veggies-settings'),
      ]),
    );
  }
};
</script>

<template>
  <LocaleChanger />
  <ContentElement
    :title="$t('settings.suggestionCount')"
    :labelAttrs="{for: 'suggestions-count-slider'}"
    labelTag="label"
  >
    <input
      id="suggestions-count-slider"
      v-model.number="settings.suggestionCount"
      type="range"
      min="0"
      max="20"
      step="5"
    />
    <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
    <output for="suggestions-count-slider">{{ settings.suggestionCount }}</output>
  </ContentElement>
  <QAComponent />
  <ContentElement
    :title="$t('settings.reset.label')"
    :labelAttrs="{for: 'reset-button'}"
    labelTag="label"
  >
    <ButtonComponent
      id="reset-button"
      variant="danger"
      icon="trashCan"
      data-test-id="reset-button"
      class="self-end"
      @click="resetDialogOpen = true"
      >{{ $t('settings.reset.button') }}</ButtonComponent
    >
  </ContentElement>
  <BuildTime v-if="debugCounter < 5" @click="debugCounter++" />
  <ContentElement
    v-else
    :title="$t('settings.copy.label')"
    :labelAttrs="{for: 'copy-button'}"
    labelTag="label"
  >
    <ButtonComponent
      id="copy-button"
      variant="secondary"
      icon="contentCopy"
      data-test-id="copy-button"
      class="self-end"
      @click="copyData"
      >{{ $t('settings.copy.button') }}</ButtonComponent
    >
  </ContentElement>
  <ModalDialog v-model="resetDialogOpen" :title="$t('settings.reset.title')">
    <template #content>
      <p>{{ $t('settings.reset.text') }}</p>
    </template>
    <template #buttons>
      <ButtonComponent
        variant="secondary"
        data-test-id="cancel-button"
        @click="resetDialogOpen = false"
        >{{ $t('general.cancel') }}</ButtonComponent
      >
      <ButtonComponent
        data-test-id="confirm-button"
        variant="danger"
        icon="trashCan"
        @click="reset()"
        >{{ $t('settings.reset.button') }}</ButtonComponent
      >
    </template>
  </ModalDialog>
</template>
<style scoped>
#suggestions-count-slider {
  @apply appearance-none h-4 rounded-md;
  @apply bg-[--color-bg-alternative];

  &::-webkit-slider-thumb {
    @apply appearance-none rounded-md border-none w-6 h-6 cursor-pointer;
    @apply bg-[--color-highlight] hover:bg-sky-600;
  }
  &::-moz-range-thumb {
    @apply appearance-none rounded-md border-none w-6 h-6 cursor-pointer;
    @apply bg-[--color-highlight] hover:bg-sky-600;
  }
}
</style>
