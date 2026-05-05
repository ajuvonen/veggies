<script setup lang="ts">
import {computed, defineAsyncComponent, ref, watch} from 'vue';
import {storeToRefs} from 'pinia';
import {shuffle, sample} from 'remeda';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import {useWeekSummary} from '@/hooks/weekSummary';
import {useShare} from '@/hooks/share';
import {AchievementLevel, Category} from '@/types';
import {areDatesEqual} from '@/utils/helpers';
import {CATEGORY_EMOJI} from '@/utils/constants';
import AIPermissionDialog from '@/components/AIPermissionDialog.vue';

const CategoryStatusChart = defineAsyncComponent(
  () => import('@/components/charts/CategoryStatusChart.vue'),
);
const WeekSummaryAIResult = defineAsyncComponent(
  () => import('@/components/WeekSummaryAIResult.vue'),
);

const {currentWeekStart} = storeToRefs(useActivityStore());
const {settings} = storeToRefs(useAppStateStore());

const {shareSupported, shareOrCopy} = useShare();
const {weekData, summaryMessages, promotedAchievement} = useWeekSummary();

const summary = computed(() => shuffle(sample(summaryMessages.value, 3)));
const showPermissionDialog = ref(false);
const showAISummary = ref(false);
const showWeekSummaryDialog = computed({
  get: () =>
    !!settings.value.startDate &&
    !areDatesEqual(currentWeekStart.value, settings.value.startDate) &&
    (!settings.value.summaryViewedDate ||
      Temporal.PlainDate.compare(settings.value.summaryViewedDate, currentWeekStart.value) < 0),
  set: (value) => {
    if (!value) {
      settings.value.summaryViewedDate = currentWeekStart.value;
    }
  },
});

watch(showWeekSummaryDialog, (shouldShow) => {
  if (!shouldShow) {
    showAISummary.value = false;
    showPermissionDialog.value = false;
  }
});

const shareWeeklyData = () => {
  const categoryList = Object.values(Category)
    .filter((category) => weekData.value.categoryCounts[category])
    .map((category) => `${CATEGORY_EMOJI[category]}: ${weekData.value.categoryCounts[category]}`);

  const shareProps = [weekData.value.veggies.length, categoryList.join('\n')];
  shareOrCopy('weekSummaryDialog.shareText', shareProps);
};

const handleAISummaryToggle = (value: boolean) => {
  if (value && settings.value.AIAllowed === null) {
    showPermissionDialog.value = true;
  } else {
    showAISummary.value = value;
  }
};
</script>
<template>
  <ModalDialog
    v-model="showWeekSummaryDialog"
    :title="$t('weekSummaryDialog.title', [weekData.weekNumber])"
  >
    <template #content>
      <CategoryStatusChart
        v-if="weekData.veggies.length"
        :veggies="weekData.veggies"
        alternateColorScheme
        topLabelKey="categoryStatus.topLabelLastWeek"
        class="shrink-0"
      />
      <ContentElement
        v-if="settings.AIAllowed !== false"
        :title="$t('weekSummaryDialog.AISummary')"
        :labelAttrs="{for: 'show-ai-summary-button'}"
        inline
        labelTag="label"
      >
        <ToggleComponent
          id="show-ai-summary-button"
          :modelValue="showAISummary"
          :disabled="showAISummary"
          data-test-id="show-ai-summary-button"
          @update:modelValue="handleAISummaryToggle"
        />
      </ContentElement>
      <AsyncLoader>
        <WeekSummaryAIResult v-if="showAISummary" :weekData="weekData" />
      </AsyncLoader>
      <div v-if="!showAISummary" class="grid grid-cols-[auto_1fr] gap-2">
        <template
          v-for="{emoji, translationKey, translationParameters} in summary"
          :key="`${translationKey}-${JSON.stringify(translationParameters)}`"
        >
          <WeekSummaryBadge aria-hidden="true">{{ emoji }}</WeekSummaryBadge>
          <span class="weekSummaryDialog__message">{{
            $t(translationKey, translationParameters, Number(translationParameters[0]))
          }}</span>
        </template>
        <span class="flex items-center justify-center">
          <AchievementBadge
            as="div"
            :achievement="promotedAchievement"
            :level="AchievementLevel.Gold"
            :active="true"
            noLabel
            data-test-id="promoted-achievement"
          />
        </span>
        <span class="flex items-center">{{
          $t('weekSummaryDialog.promotedAchievement', [
            $t(`achievements.${promotedAchievement}.badgeText`).replace(/\"/g, ''),
          ])
        }}</span>
      </div>
    </template>
    <template #buttons>
      <ButtonComponent
        v-if="weekData.veggies.length"
        :icon="shareSupported ? 'shareVariant' : 'contentCopy'"
        :aria-label="
          shareSupported
            ? $t('general.ariaShare', [$t('weekSummaryDialog.ariaLabel')])
            : $t('general.ariaCopy', [$t('weekSummaryDialog.ariaLabel')])
        "
        variant="secondary"
        :data-test-id="
          shareSupported ? 'week-summary-dialog-share-button' : 'week-summary-dialog-copy-button'
        "
        @click="shareWeeklyData"
      >
        {{ shareSupported ? $t('general.share') : $t('general.copy') }}
      </ButtonComponent>
      <ButtonComponent
        icon="close"
        data-test-id="week-summary-dialog-close-button"
        @click="showWeekSummaryDialog = false"
      >
        {{ $t('general.close') }}
      </ButtonComponent>
    </template>
  </ModalDialog>
  <AIPermissionDialog
    v-if="settings.AIAllowed === null"
    v-model="showPermissionDialog"
    @resolve="
      (value) => {
        settings.AIAllowed = value;
        showAISummary = value;
      }
    "
  />
</template>
<style scoped>
.weekSummaryDialog__message {
  @apply flex items-center;
}
</style>
