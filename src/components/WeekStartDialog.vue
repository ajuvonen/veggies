<script setup lang="ts">
import {ref, watch, computed} from 'vue';
import {storeToRefs} from 'pinia';
import {mean, sample, shuffle} from 'remeda';
import {useActivityStore} from '@/stores/activityStore';
import {useWeekSummary} from '@/hooks/weekSummary';
import type {WeekData} from '@/utils/types';
import ModalDialog from '@/components/ModalDialog.vue';
import CategoryStatusChart from '@/components/charts/CategoryStatusChart.vue';

const {currentWeekStart, veggiesForWeek, challenges, hotStreak, atMostVeggies, weeks} =
  storeToRefs(useActivityStore());

const dialogOpen = ref(false);

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

  return {
    atMostVeggies: atMostVeggies.value,
    challenge: lastWeekChallenge,
    firstWeek: weeks.value.length === 1,
    hotStreak: hotStreak.value,
    mean: Math.round(mean(pastVeggies) as number),
    previousWeekCount: veggiesForWeek.value(currentWeekStart.value.minus({weeks: 2})).length,
    veggies: veggiesForWeek.value(lastWeekStart),
    weekNumber: lastWeekStart.toFormat('W'),
  };
});

const {summaryMessages} = useWeekSummary(lastWeekData);
const summary = computed(() => shuffle(sample(summaryMessages.value, 3)));

watch(currentWeekStart, () => {
  dialogOpen.value = true;
});
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
          :key="translationKey"
          class="flex-container"
        >
          <span aria-hidden="true" class="flex items-center text-5xl pointer-events-none">{{
            emoji
          }}</span>
          <span class="flex items-center">{{ $t(translationKey, translationParameters) }}</span>
        </div>
      </div>
    </template>
  </ModalDialog>
</template>

<style scoped></style>
