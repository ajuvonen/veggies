<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {storeToRefs} from 'pinia';
import {Switch} from '@headlessui/vue';
import {useChartAnimations} from '@/hooks/chartAnimations';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import LocaleChanger from '@/components/LocaleChanger.vue';
import ModalDialog from '@/components/ModalDialog.vue';
import QAComponent from '@/components/QAComponent.vue';
import ExportImport from '@/components/ExportImport.vue';
import BuildTime from '@/components/BuildTime.vue';

const router = useRouter();

const {$reset: activityReset} = useActivityStore();
const appStateStore = useAppStateStore();
const {settings} = storeToRefs(appStateStore);
const {$reset: appStateReset} = appStateStore;

const {showChartAnimations, reduceMotion} = useChartAnimations();

const resetDialogOpen = ref(false);

const reset = () => {
  activityReset();
  appStateReset();
  router.push({name: 'home'});
};
</script>

<template>
  <div class="flex-container flex-col gap-4 has-scroll">
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
    <ContentElement
      :title="$t('settings.showChartAnimations')"
      :labelAttrs="{for: 'show-animations-button'}"
      labelTag="label"
    >
      <Switch
        id="show-animations-button"
        v-model="showChartAnimations"
        :disabled="reduceMotion"
        data-test-id="show-animations-button"
      >
        <div class="show-animations__toggler">
          <IconComponent :icon="showChartAnimations ? 'check' : 'close'" />
        </div>
      </Switch>
    </ContentElement>
    <QAComponent />
    <ExportImport />
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
    <BuildTime />
  </div>
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
  @apply bg-[--color-tooltip];

  &::-webkit-slider-thumb {
    @apply appearance-none rounded-md border-none w-6 h-6 cursor-pointer;
    @apply bg-[--color-highlight] hover:bg-sky-600;
  }
  &::-moz-range-thumb {
    @apply appearance-none rounded-md border-none w-6 h-6 cursor-pointer;
    @apply bg-[--color-highlight] hover:bg-sky-600;
  }
}

:deep(#show-animations-button) {
  @apply relative inline-flex h-4 w-12 items-center rounded-md;
  @apply bg-[--color-tooltip];

  &[disabled] {
    @apply opacity-50 cursor-not-allowed pointer-events-none;
  }

  > div {
    @apply inline-block w-6 h-6 transform rounded-md transition-transform;
    @apply flex items-center justify-center;
    @apply bg-[--color-bg-alternative] fill-[--color-text-alternative] hover:!bg-sky-600 hover:fill-[--color-text];
  }

  &[data-headlessui-state='checked'] > div {
    @apply translate-x-6 bg-[--color-highlight] fill-[--color-text];
  }
}
</style>
