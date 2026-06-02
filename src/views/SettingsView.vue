<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {storeToRefs} from 'pinia';
import {useChartAnimations} from '@/hooks/chartAnimations';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';

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
    <SliderComponent
      v-model="settings.suggestionCount"
      :title="$t('settings.suggestionCount')"
      :min="0"
      :max="20"
      :step="5"
      prefix="suggestions-count"
    />
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
      />
    </ContentElement>
    <ContentElement
      :title="$t('settings.showVeggieFacts')"
      :labelAttrs="{for: 'show-veggie-facts-button'}"
      labelTag="label"
    >
      <ToggleComponent
        id="show-veggie-facts-button"
        v-model="settings.showVeggieFacts"
        data-test-id="show-veggie-facts-button"
      />
    </ContentElement>
    <ContentElement
      v-if="settings.AIAllowed !== null"
      :title="$t('settings.AIAllowed')"
      :labelAttrs="{for: 'ai-enabled-button'}"
      labelTag="label"
    >
      <ToggleComponent
        id="ai-enabled-button"
        v-model="settings.AIAllowed"
        data-test-id="ai-enabled-button"
      />
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
