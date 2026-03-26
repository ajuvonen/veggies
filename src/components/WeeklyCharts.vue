<script lang="ts" setup>
import {computed, defineAsyncComponent, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useActivityStore} from '@/stores/activityStore';
import {useDateTime} from '@/hooks/dateTime';

const WeeklyCategoriesChart = defineAsyncComponent(
  () => import('@/components/charts/WeeklyCategoriesChart.vue'),
);
const WeeklyHeatmap = defineAsyncComponent(() => import('@/components/charts/WeeklyHeatmap.vue'));

const {getWeekStarts} = storeToRefs(useActivityStore());

const {formatWeekNumber} = useDateTime();

const selectedStatistic = ref(0);

const weekStarts = computed(() => getWeekStarts.value.slice().reverse());

const labels = computed(() => weekStarts.value.map(formatWeekNumber));

const statisticOptions = [
  {value: 0, label: 'stats.weeklyAmounts'},
  {value: 1, label: 'stats.weeklyCategories'},
  {value: 2, label: 'stats.weeklyHeatmap'},
];
</script>
<template>
  <RadioGroupRoot v-model="selectedStatistic" asChild>
    <ContentElement
      :title="$t('stats.selectStatistic')"
      :labelAttrs="{id: 'statistic-selector-title'}"
      labelTag="h2"
      aria-labelledby="statistic-selector-title"
    >
      <RadioGroupItem
        v-for="option in statisticOptions"
        :key="option.value"
        :value="option.value"
        asChild
      >
        <ButtonComponent
          :icon="selectedStatistic === option.value ? 'radioboxMarked' : 'radioboxBlank'"
          :data-test-id="`statistic-selector-${option.value}`"
        >
          {{ $t(option.label) }}
        </ButtonComponent>
      </RadioGroupItem>
    </ContentElement>
  </RadioGroupRoot>
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
