<script setup lang="ts">
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {Chart as ChartJS, ArcElement, Tooltip, type Plugin, type ChartOptions} from 'chart.js';
import {Doughnut} from 'vue-chartjs';
import ChartDataLabels, {type Context} from 'chartjs-plugin-datalabels';
import {entries, groupBy, map, pipe, prop, sortBy} from 'remeda';
import type {Category, Listing} from '@/utils/types';
import {CATEGORY_EMOJI, COLORS} from '@/utils/constants';
import {getCategoryForVeggie, getChartOptions} from '@/utils/helpers';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';

ChartJS.register(ArcElement, Tooltip);
ChartJS.register(ChartDataLabels);

const props = defineProps<{
  currentVeggies: string[];
}>();

const {t} = useI18n();

const chartData = computed(() => {
  const veggies = pipe(
    props.currentVeggies,
    map((veggie) => ({
      veggie,
      category: getCategoryForVeggie(veggie),
    })),
    groupBy(prop('category')),
    entries<Record<string, Listing[]>>,
    sortBy(([, {length}]) => length),
  );

  return {
    labels: veggies.map(prop(0)),
    datasets: [
      {
        data: veggies.map(([, {length}]) => length),
        backgroundColor: [...COLORS.chartColors],
      },
    ],
  };
});

const chartOptions = computed(
  () =>
    ({
      ...getChartOptions<'doughnut'>(),
      layout: {
        padding: 0,
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
    }) as ChartOptions<'doughnut'>,
);

defineExpose({chartData});
</script>
<template>
  <Doughnut
    :data="chartData"
    :plugins="[ChartDataLabels as Plugin<'doughnut'>]"
    :options="chartOptions"
    aria-describedby="week-status-table"
  />
  <ChartScreenReaderTable
    id="week-status-table"
    :title="$t('weekStatus.veggiesOfTheWeek')"
    :columnHeaders="chartData.labels.map((category) => t(`categories.${category}`))"
    :data="[chartData.datasets[0].data]"
  />
</template>
