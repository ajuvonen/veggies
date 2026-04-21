<script setup lang="ts">
import {computed, defineAsyncComponent, ref, watch} from 'vue';
import {storeToRefs} from 'pinia';
import {mean, sample, shuffle, countBy} from 'remeda';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import {useWeekSummary} from '@/hooks/weekSummary';
import {useShare} from '@/hooks/share';
import {AchievementLevel, Category, type Achievements, type WeekData} from '@/types';
import {areDatesEqual, getCategoryForVeggie, getRandomItem} from '@/utils/helpers';
import {CATEGORY_EMOJI} from '@/utils/constants';
import AIPermissionDialog from '@/components/AIPermissionDialog.vue';
import WeekSummaryAIResult from '@/components/WeekSummaryAIResult.vue';

const CategoryStatusChart = defineAsyncComponent(
  () => import('@/components/charts/CategoryStatusChart.vue'),
);

const {
  currentWeekStart,
  veggiesForWeek,
  challengeForWeek,
  hotStreak,
  atMostVeggies,
  weeks,
  allVeggies,
} = storeToRefs(useActivityStore());

const {settings} = storeToRefs(useAppStateStore());

const {shareSupported, shareOrCopy} = useShare();

const lastWeekData = ref<WeekData | null>(null);
const {summaryMessages} = useWeekSummary(lastWeekData);
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

const weeklyAchievements: (keyof Achievements)[] = [
  'allOnRed',
  'botanicalBerries',
  'goNuts',
  'lemons',
  'overachiever',
  'rainbow',
  'tearnado',
];

watch(
  showWeekSummaryDialog,
  (shouldShow) => {
    if (shouldShow) {
      const lastWeekStart = currentWeekStart.value.subtract({weeks: 1});
      const lastWeekChallenge = challengeForWeek.value(lastWeekStart);

      const pastVeggies = Array.from(
        {length: Math.min(5, weeks.value.length)},
        (_, weekIndex) =>
          veggiesForWeek.value(currentWeekStart.value.subtract({weeks: weekIndex + 1})).length,
      );

      const lastWeekVeggies = veggiesForWeek.value(lastWeekStart);
      const veggieCounts = countBy(allVeggies.value, (veggie) => veggie);
      const firstTimeVeggies =
        weeks.value.length >= 2
          ? lastWeekVeggies.filter((veggie) => veggieCounts[veggie] === 1)
          : [];

      lastWeekData.value = {
        atMostVeggies: atMostVeggies.value,
        challenge: lastWeekChallenge,
        firstTimeVeggies,
        firstWeek: weeks.value.length === 1,
        hotStreak: hotStreak.value,
        mean: Math.round(mean(pastVeggies) as number),
        previousWeekCount: veggiesForWeek.value(currentWeekStart.value.subtract({weeks: 2})).length,
        promotedAchievement: getRandomItem(weeklyAchievements)!,
        veggies: lastWeekVeggies,
        weekNumber: lastWeekStart.weekOfYear!,
      };
    } else {
      lastWeekData.value = null;
      showAISummary.value = false;
      showPermissionDialog.value = false;
    }
  },
  {immediate: true},
);
const shareWeeklyData = () => {
  const categoryList: string[] = [];
  Object.keys(Category).forEach((category) => {
    const veggiesInCategory = lastWeekData.value!.veggies.filter(
      (veggie) => getCategoryForVeggie(veggie) === category,
    );
    if (veggiesInCategory.length) {
      categoryList.push(`${CATEGORY_EMOJI[category as Category]}: ${veggiesInCategory.length}`);
    }
  });

  const shareProps = [lastWeekData.value!.veggies.length, categoryList.join('\n')];
  shareOrCopy('weekSummaryDialog.shareText', shareProps);
};

const handleAISummaryToggle = (value: boolean) => {
  if (value && settings.value.AIAllowed === null) {
    showPermissionDialog.value = true;
  } else {
    showAISummary.value = value;
  }
};

defineExpose({
  lastWeekData,
});
</script>

<template>
  <ModalDialog
    v-if="lastWeekData"
    v-model="showWeekSummaryDialog"
    :title="$t('weekSummaryDialog.title', [lastWeekData.weekNumber])"
  >
    <template #content>
      <CategoryStatusChart
        v-if="lastWeekData.veggies.length"
        :veggies="lastWeekData.veggies"
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
      <WeekSummaryAIResult v-if="showAISummary" :weekData="lastWeekData" />
      <div v-else class="grid grid-cols-[auto_1fr] gap-2">
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
            :achievement="lastWeekData.promotedAchievement"
            :level="AchievementLevel.Gold"
            :active="true"
            noLabel
            data-test-id="promoted-achievement"
          />
        </span>
        <span class="flex items-center">{{
          $t('weekSummaryDialog.promotedAchievement', [
            $t(`achievements.${lastWeekData.promotedAchievement}.badgeText`).replace(/\"/g, ''),
          ])
        }}</span>
      </div>
    </template>
    <template #buttons>
      <ButtonComponent
        v-if="lastWeekData.veggies.length"
        :icon="shareSupported ? 'shareVariant' : 'contentCopy'"
        :aria-label="shareSupported ? $t('general.share') : $t('general.copy')"
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
    v-if="lastWeekData && settings.AIAllowed === null"
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
