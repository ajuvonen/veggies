<script lang="ts" setup>
import {computed, defineAsyncComponent, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {storeToRefs} from 'pinia';
import {useActivityStore} from '@/stores/activityStore';
import {useDateTime} from '@/hooks/dateTime';

const WeeklyCategoriesChart = defineAsyncComponent(
  () => import('@/components/charts/WeeklyCategoriesChart.vue'),
);
const WeeklyHeatmap = defineAsyncComponent(() => import('@/components/charts/WeeklyHeatmap.vue'));

const {getWeekStarts} = storeToRefs(useActivityStore());

const {formatWeekNumber} = useDateTime();
const {t} = useI18n();

const selectedStatistic = ref(0);

const weekStarts = computed(() => getWeekStarts.value.slice().reverse());

const labels = computed(() => weekStarts.value.map(formatWeekNumber));

const statisticOptions = computed(() => [
  {value: 0, label: t('stats.weeklyAmounts')},
  {value: 1, label: t('stats.weeklyCategories')},
  {value: 2, label: t('stats.weeklyHeatmap')},
]);
</script>
<template>
  <RadioGroupComponent
    v-model="selectedStatistic"
    :title="$t('stats.selectStatistic')"
    :options="statisticOptions"
    prefix="statistics"
  />
  <WeeklyAmountsChart v-if="selectedStatistic === 0" :labels="labels" :weekStarts="weekStarts" />
  <AsyncLoader>
    <WeeklyCategoriesChart
      v-if="selectedStatistic === 1"
      :labels="labels"
      :weekStarts="weekStarts"
    />
  </AsyncLoader>
  <AsyncLoader>
    <WeeklyHeatmap v-if="selectedStatistic === 2" :labels="labels" :weekStarts="weekStarts" />
  </AsyncLoader>
</template>
