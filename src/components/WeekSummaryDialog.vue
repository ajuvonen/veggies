<script setup lang="ts">
import {computed, defineAsyncComponent} from 'vue';
import {storeToRefs} from 'pinia';
import {mean, sample, shuffle, countBy} from 'remeda';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import {useWeekSummary} from '@/hooks/weekSummary';
import type {WeekData} from '@/utils/types';
import ModalDialog from '@/components/ModalDialog.vue';

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

// Computed for previous week data
const lastWeekData = computed<WeekData>(() => {
  const lastWeekStart = currentWeekStart.value.minus({weeks: 1});
  const lastWeekChallenge = challenges.value.find(({startDate}) =>
    startDate.equals(lastWeekStart),
  )?.veggie;

  const pastVeggies = Array.from(
    {length: Math.min(5, weeks.value.length)},
    (_, weekIndex) => veggiesForWeek.value(currentWeekStart.value.minus({weeks: weekIndex})).length,
  );

  const lastWeekVeggies = veggiesForWeek.value(lastWeekStart);
  const veggieCounts = countBy(allVeggies.value, (veggie) => veggie);
  const firstTimeVeggies =
    weeks.value.length >= 2 ? lastWeekVeggies.filter((veggie) => veggieCounts[veggie] === 1) : [];

  return {
    atMostVeggies: atMostVeggies.value,
    challenge: lastWeekChallenge,
    firstTimeVeggies,
    firstWeek: weeks.value.length === 1,
    hotStreak: hotStreak.value,
    mean: Math.round(mean(pastVeggies) as number),
    previousWeekCount: veggiesForWeek.value(currentWeekStart.value.minus({weeks: 2})).length,
    veggies: lastWeekVeggies,
    weekNumber: lastWeekStart.toFormat('W'),
  };
});

const {summaryMessages} = useWeekSummary(lastWeekData);
const summary = computed(() => shuffle(sample(summaryMessages.value, 3)));
</script>

<template>
  <ModalDialog
    id="week-start-dialog"
    v-model="dialogOpen"
    :title="$t('weekStartDialog.title', [lastWeekData.weekNumber])"
  >
    <template #content>
      <div class="flex-container gap-4 flex-col">
        <CategoryStatusChart
          v-if="lastWeekData.veggies.length"
          :veggies="lastWeekData.veggies"
          alternateColorScheme
          topLabelKey="categoryStatus.topLabelLastWeek"
        />
        <div
          v-for="{emoji, translationKey, translationParameters} in summary"
          :key="`${translationKey}-${JSON.stringify(translationParameters)}`"
          class="flex-container"
        >
          <span aria-hidden="true" class="flex items-center text-5xl pointer-events-none">{{
            emoji
          }}</span>
          <span class="flex items-center">{{
            $t(translationKey, translationParameters, Number(translationParameters[0]))
          }}</span>
        </div>
      </div>
    </template>
  </ModalDialog>
</template>

<style scoped></style>
