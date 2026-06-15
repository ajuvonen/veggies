<script lang="ts" setup>
import {computed, defineAsyncComponent, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useActivityStore} from '@/stores/activityStore';
import {useDateTime} from '@/hooks/dateTime';

const WeeklyCategoriesChart = defineAsyncComponent(
  () => import('@/components/charts/WeeklyCategoriesChart.vue'),
);
const WeeklyHeatmap = defineAsyncComponent(() => import('@/components/charts/WeeklyHeatmap.vue'));
const WeeklyAchievementsChart = defineAsyncComponent(
  () => import('@/components/charts/WeeklyAchievementsChart.vue'),
);

const {getWeekStarts} = storeToRefs(useActivityStore());

const {formatWeekNumber} = useDateTime();

const selectedStatistic = ref('weeklyAmounts');

const weekStarts = computed(() => getWeekStarts.value.slice().reverse());

const labels = computed(() => weekStarts.value.map(formatWeekNumber));

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
  <WeeklyAmountsChart
    v-if="selectedStatistic === 'weeklyAmounts'"
    :labels="labels"
    :weekStarts="weekStarts"
  />
  <AsyncLoader>
    <WeeklyCategoriesChart
      v-if="selectedStatistic === 'weeklyCategories'"
      :labels="labels"
      :weekStarts="weekStarts"
    />
  </AsyncLoader>
  <AsyncLoader>
    <WeeklyHeatmap
      v-if="selectedStatistic === 'weeklyHeatmap'"
      :labels="labels"
      :weekStarts="weekStarts"
    />
  </AsyncLoader>
  <AsyncLoader>
    <WeeklyAchievementsChart
      v-if="selectedStatistic === 'weeklyAchievements'"
      :labels="labels"
      :weekStarts="weekStarts"
    />
  </AsyncLoader>
</template>
