<script lang="ts" setup>
import {computed, defineAsyncComponent, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useActivityStore} from '@/stores/activityStore';
import {useDateTime} from '@/hooks/dateTime';
import type {WeeklyChartData} from '@/types';

const WeeklyCategoriesChart = defineAsyncComponent(
  () => import('@/components/charts/WeeklyCategoriesChart.vue'),
);
const WeeklyHeatmap = defineAsyncComponent(() => import('@/components/charts/WeeklyHeatmap.vue'));
const WeeklyAchievementsChart = defineAsyncComponent(
  () => import('@/components/charts/WeeklyAchievementsChart.vue'),
);

const {getWeekStarts} = storeToRefs(useActivityStore());

const {formatWeekNumber, formatWeekString} = useDateTime();

const selectedStatistic = ref('weeklyAmounts');

const weekData = computed<WeeklyChartData>(() => {
  const weekStarts = getWeekStarts.value.slice().reverse();
  return {
    weekStarts,
    labels: weekStarts.map(formatWeekNumber),
    weekStrings: weekStarts.map(formatWeekString),
  };
});

const statisticOptions = [
  'weeklyAmounts',
  'weeklyCategories',
  'weeklyHeatmap',
  'weeklyAchievements',
];
</script>
<template>
  <DropdownList
    v-model="selectedStatistic"
    :options="statisticOptions"
    :label="$t('stats.selectStatistic')"
    prefix="statistics"
  >
    <template #option="{item}">
      {{ $t(`stats.${item}`) }}
    </template>
  </DropdownList>
  <WeeklyAmountsChart v-if="selectedStatistic === 'weeklyAmounts'" :weekData="weekData" />
  <AsyncLoader>
    <WeeklyCategoriesChart v-if="selectedStatistic === 'weeklyCategories'" :weekData="weekData" />
  </AsyncLoader>
  <AsyncLoader>
    <WeeklyHeatmap v-if="selectedStatistic === 'weeklyHeatmap'" :weekData="weekData" />
  </AsyncLoader>
  <AsyncLoader>
    <WeeklyAchievementsChart
      v-if="selectedStatistic === 'weeklyAchievements'"
      :weekData="weekData"
    />
  </AsyncLoader>
</template>
