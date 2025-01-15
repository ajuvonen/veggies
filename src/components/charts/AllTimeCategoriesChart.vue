<script lang="ts" setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Title,
  type ChartOptions,
} from 'chart.js';
import {PolarArea} from 'vue-chartjs';
import {countBy, entries, pipe, prop, sortBy} from 'remeda';
import ChartDataLabels, {type Context} from 'chartjs-plugin-datalabels';
import {CATEGORY_EMOJI, COLORS} from '@/utils/constants';
import {getCategoryForVeggie, getChartOptions} from '@/utils/helpers';
import {Category} from '@/utils/types';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';

ChartJS.defaults.font.family = 'Nunito';
ChartJS.register(Tooltip, ArcElement, RadialLinearScale, Title, ChartDataLabels);

const props = defineProps<{
  veggies: string[];
}>();

const {t} = useI18n();

const chartData = computed(() => {
  const veggies = pipe(props.veggies, countBy(getCategoryForVeggie), entries(), sortBy(prop(1)));

  return {
    labels: veggies.map(prop(0)),
    datasets: [
      {
        data: veggies.map(prop(1)),
        backgroundColor: [...COLORS.chartColorsAlternate],
      },
    ],
  };
});

const chartOptions = computed(() => {
  const defaultOptions = getChartOptions<'polarArea'>(false, false, true);
  return {
    ...defaultOptions,
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
      ...defaultOptions.plugins,
      tooltip: {
        callbacks: {
          title: ([{label}]) => t(`categories.${label}`),
        },
      },
      datalabels: {
        ...defaultOptions.plugins?.datalabels,
        formatter: (_, context: Context) =>
          CATEGORY_EMOJI[context.chart.data.labels![context.dataIndex] as Category],
      },
    },
  } as ChartOptions<'polarArea'>;
});

defineExpose({chartData});
</script>
<template>
  <ContentElement :title="$t('stats.allTimeCategories')" :labelAttrs="{'aria-hidden': true}">
    <div class="relative flex-1">
      <PolarArea
        :options="chartOptions"
        :data="chartData"
        data-test-id="all-time-categories-chart"
        aria-describedby="all-time-categories-table"
      />
      <ChartScreenReaderTable
        id="all-time-categories-table"
        :title="$t('stats.allTimeCategories')"
        :columnHeaders="chartData.labels.map((category) => t(`categories.${category}`))"
        :data="[chartData.datasets[0].data]"
      />
    </div>
  </ContentElement>
</template>
