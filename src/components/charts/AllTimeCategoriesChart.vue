<script lang="ts" setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  LinearScale,
  CategoryScale,
  type ChartOptions,
} from 'chart.js';
import {PolarArea} from 'vue-chartjs';
import {entries, groupBy, map, pipe, prop, sortBy} from 'remeda';
import {CATEGORY_EMOJI, COLORS} from '@/utils/constants';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';
import {getCategoryForVeggie, getChartOptions} from '@/utils/helpers';
import ChartDataLabels, {type Context} from 'chartjs-plugin-datalabels';
import type {Category} from '@/utils/types';

ChartJS.register(Tooltip, ArcElement, RadialLinearScale, LinearScale, CategoryScale);
ChartJS.register(ChartDataLabels);

const props = defineProps<{
  veggies: string[];
}>();

const {t} = useI18n();

const chartData = computed(() => {
  const veggies = pipe(
    props.veggies,
    map((veggie) => ({
      veggie,
      category: getCategoryForVeggie(veggie),
    })),
    groupBy(prop('category')),
    entries(),
    sortBy(([, {length}]) => length),
  );

  return {
    labels: veggies.map(prop(0)),
    datasets: [
      {
        data: veggies.map(([, {length}]) => length),
        backgroundColor: [...COLORS.chartColorsAlternate],
      },
    ],
  };
});

const chartOptions = computed(
  () =>
    ({
      ...getChartOptions<'polarArea'>(),
      scales: {
        r: {
          ticks: {
            display: false,
          },
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            title: ([{label}]) => t(`categories.${label}`),
          },
          boxPadding: 5,
        },
        datalabels: {
          anchor: 'center',
          align: 'center',
          font: {
            size: 25,
          },
          textShadowColor: '#fff',
          textShadowBlur: 3,
          formatter: (_, context: Context) =>
            CATEGORY_EMOJI[context.chart.data.labels![context.dataIndex] as Category],
        },
      },
    }) as ChartOptions<'polarArea'>,
);

defineExpose({chartData});
</script>
<template>
  <div class="w-full h-full">
    <PolarArea
      :options="chartOptions"
      :data="chartData"
      data-test-id="all-time-categories-chart"
      aria-describedby="all-time-categories-chart-table"
    />
    <ChartScreenReaderTable
      id="all-time-categories-chart-table"
      :title="$t('stats.allTimeCategories')"
      :columnHeaders="chartData.labels.map((category) => t(`categories.${category}`))"
      :data="[chartData.datasets[0].data]"
    />
  </div>
</template>
