<script setup lang="ts">
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {Chart as ChartJS, ArcElement, Tooltip, type ChartOptions} from 'chart.js';
import {Doughnut} from 'vue-chartjs';
import ChartDataLabels, {type Context} from 'chartjs-plugin-datalabels';
import {filter, map, pipe, prop, sortBy} from 'remeda';
import {Category} from '@/utils/types';
import {CATEGORY_EMOJI, COLORS} from '@/utils/constants';
import {getCategoryForVeggie, getChartOptions} from '@/utils/helpers';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';

ChartJS.register(ArcElement, Tooltip);
ChartJS.register(ChartDataLabels);

const props = withDefaults(
  defineProps<{
    veggies: string[];
    totals?: boolean;
  }>(),
  {
    totals: false,
  },
);

const {t} = useI18n();

const chartData = computed(() => {
  const veggies = pipe(
    Object.values(Category),
    map((category) => [
      category,
      props.veggies.filter((veggie) => getCategoryForVeggie(veggie) === category),
    ]),
    filter(([, {length}]) => !!length),
    sortBy(([, {length}]) => length),
  );

  return {
    labels: veggies.map(prop(0)),
    datasets: [
      {
        data: veggies.map(([, {length}]) => length),
        backgroundColor: [...(props.totals ? COLORS.chartColorsAlternate : COLORS.chartColors)],
      },
    ],
  };
});

const chartOptions = computed(() => {
  const defaultOptions = getChartOptions<'doughnut'>(false, false, true);
  return {
    ...defaultOptions,
    plugins: {
      ...defaultOptions.plugins,
      tooltip: {
        callbacks: {
          title: ([{label}]) => t(`categories.${label}`),
        },
        boxPadding: 5,
      },
      datalabels: {
        ...defaultOptions.plugins?.datalabels,
        formatter: (_, context: Context) =>
          CATEGORY_EMOJI[context.chart.data.labels![context.dataIndex] as Category],
      },
    },
  } as ChartOptions<'doughnut'>;
});

defineExpose({chartData});
</script>
<template>
  <Doughnut
    :data="chartData"
    :options="chartOptions"
    aria-describedby="category-status-table"
    data-test-id="category-status-chart"
  />
  <ChartScreenReaderTable
    id="category-status-table"
    :title="totals ? $t('categoryStatus.veggiesTotal') : $t('categoryStatus.veggiesOfTheWeek')"
    :columnHeaders="chartData.labels.map((category) => t(`categories.${category}`))"
    :data="[chartData.datasets[0].data]"
  />
</template>
