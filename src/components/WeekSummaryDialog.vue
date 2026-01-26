<script setup lang="ts">
import {computed, defineAsyncComponent, ref, watch} from 'vue';
import {storeToRefs} from 'pinia';
import {mean, sample, shuffle, countBy} from 'remeda';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import {useWeekSummary} from '@/hooks/weekSummary';
import {useShare} from '@/hooks/share';
import {AchievementLevel, Category, type Achievements, type WeekData} from '@/types';
import {getCategoryForVeggie, getRandomItem} from '@/utils/helpers';
import {CATEGORY_EMOJI} from '@/utils/constants';
import AchievementBadge from '@/components/AchievementBadge.vue';
import WeekSummaryBadge from '@/components/WeekSummaryBadge.vue';

const CategoryStatusChart = defineAsyncComponent(
  () => import('@/components/charts/CategoryStatusChart.vue'),
);

const {currentWeekStart, veggiesForWeek, hotStreak, atMostVeggies, weeks, allVeggies} =
  storeToRefs(useActivityStore());

const {settings} = storeToRefs(useAppStateStore());

const {shareSupported, shareOrCopy} = useShare();

const dialogOpen = computed({
  get: () =>
    !!settings.value.startDate &&
    !currentWeekStart.value.equals(settings.value.startDate) &&
    (!settings.value.summaryViewedDate ||
      settings.value.summaryViewedDate < currentWeekStart.value),
  set: (value) => {
    if (!value) {
      settings.value.summaryViewedDate = currentWeekStart.value;
    }
  },
});

const lastWeekData = ref<WeekData | null>(null);
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
  dialogOpen,
  (shouldShow) => {
    if (shouldShow) {
      const lastWeekStart = currentWeekStart.value.minus({weeks: 1});
      const lastWeekChallenge = weeks.value.find((week) =>
        week.startDate.equals(lastWeekStart),
      )?.challenge;

      const pastVeggies = Array.from(
        {length: Math.min(5, weeks.value.length)},
        (_, weekIndex) =>
          veggiesForWeek.value(currentWeekStart.value.minus({weeks: weekIndex + 1})).length,
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
        previousWeekCount: veggiesForWeek.value(currentWeekStart.value.minus({weeks: 2})).length,
        promotedAchievement: getRandomItem(weeklyAchievements)!,
        veggies: lastWeekVeggies,
        weekNumber: lastWeekStart.toFormat('W'),
      };
    } else {
      lastWeekData.value = null;
    }
  },
  {immediate: true},
);

const {summaryMessages} = useWeekSummary(lastWeekData);
const summary = computed(() => shuffle(sample(summaryMessages.value, 3)));

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

defineExpose({
  lastWeekData,
});
</script>

<template>
  <ModalDialog
    v-if="lastWeekData"
    v-model="dialogOpen"
    :title="$t('weekSummaryDialog.title', [lastWeekData.weekNumber])"
    data-test-id="week-summary-dialog"
  >
    <template #content>
      <div class="flex gap-4 flex-col">
        <CategoryStatusChart
          v-if="lastWeekData.veggies.length"
          :veggies="lastWeekData.veggies"
          alternateColorScheme
          topLabelKey="categoryStatus.topLabelLastWeek"
        />
        <div class="grid grid-cols-[auto_1fr] gap-2">
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
        @click="dialogOpen = false"
      >
        {{ $t('general.close') }}
      </ButtonComponent>
    </template>
  </ModalDialog>
</template>
<style scoped>
.weekSummaryDialog__message {
  @apply flex items-center;
}
</style>
