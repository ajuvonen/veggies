<script setup lang="ts">
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {storeToRefs} from 'pinia';
import {Chart as ChartJS, ArcElement, Tooltip, type Plugin, type ChartOptions} from 'chart.js';
import {Doughnut} from 'vue-chartjs';
import ChartDataLabels, {type Context} from 'chartjs-plugin-datalabels';
import {entries, groupBy, pipe, prop, sortBy} from 'remeda';
import useDateTime from '@/hooks/dateTime';
import {useActivityStore} from '@/stores/activityStore';
import type {Ingredient} from '@/utils/types';

ChartJS.register(ArcElement, Tooltip);
ChartJS.register(ChartDataLabels);

const {t} = useI18n();

const {getCurrentIngredients} = storeToRefs(useActivityStore());

const {getTotalWeeks, getDateInterval} = useDateTime();

const chartData = computed(() => {
  const ingredients = pipe(
    getCurrentIngredients.value,
    groupBy(prop('category')),
    entries<Record<string, Ingredient[]>>,
    sortBy(([_, {length}]) => length),
  );

  console.log(ingredients);
  return {
    labels: ingredients.map(([category]) => t(`categories.${category}`)),
    datasets: [
      {
        data: ingredients.map(([_, {length}]) => length),
        backgroundColor: ['#bae6fd', '#38bdf8', '#0284c7', '#075985', '#082f49'],
      },
    ],
  };
});

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    datalabels: {
      color: '#fff',
      anchor: 'center',
      align: 'center',
      font: {
        weight: 'bold',
      },
      formatter: (_, context: Context) => {
        return context.chart.data.labels![context.dataIndex];
      },
    },
  },
};
</script>
<template>
  <div class="week-status">
    <h1 class="text-xl">
      {{ $t('general.weekInterval', [getTotalWeeks]) }}
    </h1>
    <span class="text-xs">{{ getDateInterval(getTotalWeeks - 1) }}</span>
    <div class="relative">
      <Doughnut
        :data="chartData"
        :plugins="[ChartDataLabels as Plugin<'doughnut'>]"
        :options="chartOptions"
      />
      <div class="week-status__center-label">
        <span>{{ $t('weekStatus.topLabel') }}</span>
        <span class="text-6xl">{{ getCurrentIngredients.length }}</span>
        <span>{{ $t('weekStatus.bottomLabel') }}</span>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.week-status {
  @apply flex flex-col gap-2 items-center justify-center;
  @apply mb-4 uppercase;
}

:deep(canvas) {
  @apply relative z-10;
}

.week-status__center-label {
  @apply flex flex-col items-center justify-center;
  @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs;
}
</style>
