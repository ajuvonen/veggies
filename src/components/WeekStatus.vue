<script setup lang="ts">
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {storeToRefs} from 'pinia';
import {Chart as ChartJS, ArcElement, Tooltip, type Plugin, type ChartOptions} from 'chart.js';
import {Doughnut} from 'vue-chartjs';
import ChartDataLabels, {type Context} from 'chartjs-plugin-datalabels';
import {entries, groupBy, pipe, prop, sortBy} from 'remeda';
import {useActivityStore} from '@/stores/activityStore';
import type {Category, Ingredient} from '@/utils/types';
import {CATEGORY_EMOJI} from '@/utils/constants';

ChartJS.register(ArcElement, Tooltip);
ChartJS.register(ChartDataLabels);

const {t} = useI18n();

const {getCurrentIngredients} = storeToRefs(useActivityStore());

const chartData = computed(() => {
  const ingredients = pipe(
    getCurrentIngredients.value,
    groupBy(prop('category')),
    entries<Record<string, Ingredient[]>>,
    sortBy(([_, {length}]) => length),
  );

  return {
    labels: ingredients.map(prop(0)),
    datasets: [
      {
        data: ingredients.map(([_, {length}]) => length),
        backgroundColor: ['#f0f9ff', '#bae6fd', '#38bdf8', '#0284c7', '#075985', '#082f49'],
      },
    ],
  };
});

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    tooltip: {
      callbacks: {
        title: ([{label}]) => t(`categories.${label}`),
      },
      boxPadding: 5,
    },
    datalabels: {
      color: '#fff',
      anchor: 'center',
      align: 'center',
      font: {
        size: 25,
      },
      textShadowColor: '#fff',
      textShadowBlur: 2,
      formatter: (_, context: Context) =>
        CATEGORY_EMOJI[context.chart.data.labels![context.dataIndex] as Category],
    },
  },
};
</script>
<template>
  <div class="week-status">
    <div class="relative">
      <Doughnut
        :data="chartData"
        :plugins="[ChartDataLabels as Plugin<'doughnut'>]"
        :options="chartOptions"
      />
      <h1 class="week-status__center-label">
        <span>{{ $t('weekStatus.topLabel') }}</span>
        <span class="text-6xl">{{ getCurrentIngredients.length }}</span>
        <span>{{ $t('weekStatus.bottomLabel') }}</span>
      </h1>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.week-status {
  @apply flex flex-col gap-2 items-center justify-center;
  @apply uppercase;
}

:deep(canvas) {
  @apply relative z-10;
}

.week-status__center-label {
  @apply flex flex-col items-center justify-center;
  @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs;
}
</style>
