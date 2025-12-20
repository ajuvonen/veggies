<script lang="ts" setup>
import {computed, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {RadioGroup, RadioGroupLabel, RadioGroupOption} from '@headlessui/vue';
import {useActivityStore} from '@/stores/activityStore';
import WeeklyAmountsChart from '@/components/charts/WeeklyAmountsChart.vue';
import WeeklyCategoriesChart from '@/components/charts/WeeklyCategoriesChart.vue';
import WeeklyHeatmap from '@/components/charts/WeeklyHeatmap.vue';

const {getWeekStarts} = storeToRefs(useActivityStore());

const selectedStatistic = ref(0);

const weekStarts = computed(() => getWeekStarts.value.slice().reverse());

const statisticOptions = [
  {value: 0, label: 'stats.weeklyAmounts'},
  {value: 1, label: 'stats.weeklyCategories'},
  {value: 2, label: 'stats.weeklyHeatmap'},
];
</script>
<template>
  <div class="flex flex-col gap-4" data-test-id="weekly-charts">
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
    <WeeklyAmountsChart v-if="selectedStatistic === 0" :weekStarts="weekStarts" />
    <WeeklyCategoriesChart v-if="selectedStatistic === 1" :weekStarts="weekStarts" />
    <WeeklyHeatmap v-if="selectedStatistic === 2" :weekStarts="weekStarts" />
  </div>
</template>
