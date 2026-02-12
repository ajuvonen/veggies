<script lang="ts" setup>
import {computed, defineAsyncComponent, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {RadioGroup, RadioGroupLabel, RadioGroupOption} from '@headlessui/vue';
import {useActivityStore} from '@/stores/activityStore';
import {useDateTime} from '@/hooks/dateTime';
import WeeklyAmountsChart from '@/components/charts/WeeklyAmountsChart.vue';
import AsyncLoader from '@/components/AsyncLoader.vue';

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
  <RadioGroup v-model="selectedStatistic">
    <ContentElement :title="$t('stats.selectStatistic')" :labelTag="RadioGroupLabel">
      <RadioGroupOption
        v-for="option in statisticOptions"
        as="template"
        :key="option.value"
        :value="option.value"
        v-slot="{checked}"
      >
        <ButtonComponent
          :icon="checked ? 'radioboxMarked' : 'radioboxBlank'"
          :data-test-id="`statistic-selector-${option.value}`"
        >
          <RadioGroupLabel as="span">{{ $t(option.label) }}</RadioGroupLabel>
        </ButtonComponent>
      </RadioGroupOption>
    </ContentElement>
  </RadioGroup>
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
