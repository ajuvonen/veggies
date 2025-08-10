<script setup lang="ts">
import {computed, defineAsyncComponent, ref, watch} from 'vue';
import {storeToRefs} from 'pinia';
import {mean, sample, shuffle, countBy} from 'remeda';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import {useWeekSummary} from '@/hooks/weekSummary';
import {AchievementLevel, type Achievements, type WeekData} from '@/utils/types';
import ModalDialog from '@/components/ModalDialog.vue';
import AchievementBadge from '@/components/AchievementBadge.vue';
import WeekSummaryBadge from './WeekSummaryBadge.vue';

const CategoryStatusChart = defineAsyncComponent(
  () => import('@/components/charts/CategoryStatusChart.vue'),
);

const {
  currentWeekStart,
  startDate,
  veggiesForWeek,
  challenges,
  hotStreak,
  atMostVeggies,
  weeks,
  allVeggies,
} = storeToRefs(useActivityStore());

const {settings} = storeToRefs(useAppStateStore());

const dialogOpen = computed({
  get: () =>
    !!startDate.value &&
    !currentWeekStart.value.equals(startDate.value) &&
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
  'rainbow',
];

watch(
  dialogOpen,
  (shouldShow) => {
    if (shouldShow) {
      const lastWeekStart = currentWeekStart.value.minus({weeks: 1});
      const lastWeekChallenge = challenges.value.find(({startDate}) =>
        startDate.equals(lastWeekStart),
      )?.veggie;

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
        promotedAchievement:
          weeklyAchievements[Math.floor(Math.random() * weeklyAchievements.length)],
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

defineExpose({
  lastWeekData,
});
</script>

<template>
  <ModalDialog
    id="week-start-dialog"
    v-if="lastWeekData"
    v-model="dialogOpen"
    :title="$t('weekSummaryDialog.title', [lastWeekData.weekNumber])"
  >
    <template #content>
      <div class="flex-container gap-4 flex-col">
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
            <WeekSummaryBadge aria-hidden="true" class="weekSummaryDialog__emoji">{{
              emoji
            }}</WeekSummaryBadge>
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
              $t(`achievements.${lastWeekData.promotedAchievement}.badgeText`),
            ])
          }}</span>
        </div>
      </div>
    </template>
  </ModalDialog>
</template>
<style scoped>
.weekSummaryDialog__message {
  @apply flex items-center;
}
</style>
