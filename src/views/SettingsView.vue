<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {storeToRefs} from 'pinia';
import {useChartAnimations} from '@/hooks/chartAnimations';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import LocaleChanger from '@/components/LocaleChanger.vue';
import ModalDialog from '@/components/ModalDialog.vue';
import QAComponent from '@/components/QAComponent.vue';
import ExportImport from '@/components/ExportImport.vue';
import BuildTime from '@/components/BuildTime.vue';
import VeggieSearch from '@/components/VeggieSearch.vue';
import TagsComponent from '@/components/TagsComponent.vue';
import ToggleComponent from '@/components/ToggleComponent.vue';

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

const removeAllergen = (veggie: string) => {
  settings.value.allergens = settings.value.allergens.filter((allergen) => allergen !== veggie);
};
</script>

<template>
  <div class="flex flex-col gap-4 has-scroll">
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
      <ToggleComponent
        id="show-animations-button"
        v-model="showChartAnimations"
        :disabled="reduceMotion"
        data-test-id="show-animations-button"
      >
      </ToggleComponent>
    </ContentElement>
    <ContentElement
      :title="$t('settings.allergens')"
      :labelAttrs="{for: 'veggie-search-input'}"
      labelTag="label"
    >
      <VeggieSearch v-model="settings.allergens" :placeholder="$t('settings.selectAllergens')" />
      <TagsComponent
        :veggies="settings.allergens"
        :variant="['tag', 'remove']"
        :toggleFn="(veggie) => removeAllergen(veggie)"
        :class="{hidden: !settings.allergens.length}"
        :ariaLabel="$t('settings.selectedAllergens')"
        ariaTagKey="general.clickToRemove"
        icon="minus"
      />
      <p>{{ $t('settings.allergensInfo') }}</p>
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
  @apply appearance-none h-4 rounded-md outline-offset-4;
  @apply bg-[--color-ui-dark];

  &::-webkit-slider-thumb {
    @apply appearance-none rounded-md border-none w-6 h-6 cursor-pointer;
    @apply bg-[--color-primary] hover:bg-[--color-primary-hover] active:bg-[--color-primary-active];
  }
  &::-moz-range-thumb {
    @apply appearance-none rounded-md border-none w-6 h-6 cursor-pointer;
    @apply bg-[--color-primary] hover:bg-[--color-primary-hover] active:bg-[--color-primary-active];
  }
}
</style>
