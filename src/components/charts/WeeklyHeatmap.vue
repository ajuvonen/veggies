<script lang="ts" setup>
import {computed, onMounted, useTemplateRef} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {groupByProp} from 'remeda';
import {Chart as ChartJS, Tooltip, type ScaleOptions, type ScriptableContext} from 'chart.js';
import type {MatrixDataPoint} from 'chartjs-chart-matrix';
import type {DateTime} from 'luxon';
import {useDateTime} from '@/hooks/dateTime';
import {useChartContainer} from '@/hooks/chartContainer';
import {useChartOptions} from '@/hooks/chartOptions';
import {useActivityStore} from '@/stores/activityStore';
import {CATEGORY_EMOJI, COLORS} from '@/utils/constants';
import {Category} from '@/types';
import {getCategoryForVeggie} from '@/utils/helpers';
import {HeatmapChart} from '@/components/charts/HeatmapChart';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';

ChartJS.defaults.font.family = 'Nunito';
ChartJS.register(Tooltip);

const props = defineProps<{
  labels: string[];
  weekStarts: DateTime[];
}>();

const {t} = useI18n();

const {veggiesForWeek} = storeToRefs(useActivityStore());

const {formatWeekString, formatWeekNumber} = useDateTime();

const chartContainer = useTemplateRef('chartContainer');
const {xAlign, yAlign} = useChartContainer(chartContainer);

const chartData = computed(() => {
  const datasets = [
    {
      data: Object.values(props.weekStarts).flatMap((weekStart) => {
        const veggies = veggiesForWeek.value(weekStart);
        return Object.values(Category).map(
          (category) =>
            ({
              x: formatWeekNumber(weekStart),
              y: CATEGORY_EMOJI[category],
              v: veggies.filter((veggie) => getCategoryForVeggie(veggie) === category).length,
              weekString: formatWeekString(weekStart),
              category,
            }) as unknown as MatrixDataPoint,
        );
      }),
      backgroundColor: ({dataset, dataIndex}: ScriptableContext<'matrix'>) => {
        const value = dataset.data[dataIndex]?.v ?? 0;
        // Scale from 0 (opacity 10) to 6+ (opacity FF)
        const opacityDecimal = Math.min(16 + Math.round((value * 239) / 6), 255);
        const opacityHex = opacityDecimal.toString(16).toUpperCase().padStart(2, '0');
        return COLORS.chartColorsAlternate[2] + opacityHex;
      },
      width: ({chart}: ScriptableContext<'matrix'>) =>
        chart.chartArea.width / props.weekStarts.length - 1,
      height: ({chart}: ScriptableContext<'matrix'>) =>
        chart.chartArea.height / Object.values(Category).length - 1,
    },
  ];

  return {
    datasets,
    accessibleData: {
      rowHeaders: Object.values(Category).map((category) => t(`categories.${category}`)),
      data: Object.values(groupByProp(datasets[0]!.data, 'category')).map((items) =>
        items.map(({v}) => `${Math.round((v / 6) * 100)} %`),
      ),
    },
  };
});

const yScale: ScaleOptions = {
  type: 'category',
  labels: Object.values(Category).map((category) => CATEGORY_EMOJI[category]),
  offset: true,
  ticks: {
    font: {
      size: 25,
    },
  },
  grid: {
    display: false,
  },
};

const {chartOptions} = useChartOptions<'matrix'>(true, false, false, {
  normalized: false,
  scales: {
    x: {
      type: 'category',
      labels: props.labels,
      grid: {
        display: false,
      },
    },
    y: yScale,
    y1: yScale,
  },
  plugins: {
    tooltip: {
      xAlign,
      yAlign,
      callbacks: {
        title: ([tooltip]) => tooltip?.dataset.data[tooltip.dataIndex!]?.weekString ?? '',
        label: ({dataset, dataIndex}) =>
          `${t(`categories.${dataset.data[dataIndex]?.category}`)}: ${dataset.data[dataIndex]?.v}`,
      },
    },
  },
});

onMounted(() => {
  if (chartContainer.value) {
    chartContainer.value.scrollLeft = chartContainer.value.scrollWidth;
  }
});

defineExpose({chartData});
</script>
<template>
  <div ref="chartContainer" class="has-scroll m-0 p-0">
    <div :style="{width: `max(100%, ${weekStarts.length * 60}px)`}" class="relative h-full">
      <HeatmapChart
        id="weekly-heatmap"
        :options="chartOptions"
        :data="chartData"
        :aria-label="$t('stats.weeklyHeatmap')"
        :aria-description="$t('general.seeTableBelow')"
        data-test-id="weekly-heatmap"
      />
    </div>
    <ChartScreenReaderTable
      :title="$t('stats.weeklyHeatmap')"
      :columnHeaders="labels"
      :rowHeaders="chartData.accessibleData.rowHeaders"
      :data="chartData.accessibleData.data"
      data-test-id="weekly-heatmap-table"
    />
  </div>
</template>
