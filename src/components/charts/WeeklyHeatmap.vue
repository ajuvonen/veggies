<script lang="ts" setup>
import {computed, useTemplateRef} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {groupByProp} from 'remeda';
import {type ScaleOptions, type ScriptableContext} from 'chart.js';
import type {MatrixDataPoint} from 'chartjs-chart-matrix';
import {useChartContainer} from '@/hooks/chartContainer';
import {useChartOptions} from '@/hooks/chartOptions';
import {useActivityStore} from '@/stores/activityStore';
import {type WeeklyChartData} from '@/types';
import {CATEGORY_EMOJI, COLORS} from '@/utils/constants';
import {getCategoryForVeggie} from '@/utils/helpers';
import {Category} from '@/types';

const props = defineProps<{
  weekData: WeeklyChartData;
}>();

const {t} = useI18n();

const {veggiesForWeek} = storeToRefs(useActivityStore());

const chartContainer = useTemplateRef('chartContainer');
const {xAlign, yAlign} = useChartContainer(chartContainer);

const chartData = computed(() => {
  const datasets = [
    {
      data: props.weekData.weekStarts.flatMap((weekStart, weekIndex) => {
        const veggies = veggiesForWeek.value(weekStart);
        return Object.values(Category).map((category) => ({
          x: props.weekData.labels[weekIndex],
          y: CATEGORY_EMOJI[category],
          v: veggies.filter((veggie) => getCategoryForVeggie(veggie) === category).length,
          rawData: category,
          weekIndex,
        }));
      }),
      backgroundColor: ({dataset, dataIndex}: ScriptableContext<'matrix'>) => {
        const value = dataset.data[dataIndex]?.v ?? 0;
        // Scale from 0 (opacity 10) to 6+ (opacity FF)
        const opacityDecimal = Math.min(16 + Math.round((value * 239) / 6), 255);
        const opacityHex = opacityDecimal.toString(16).toUpperCase().padStart(2, '0');
        return COLORS.chartColorsAlternate[2] + opacityHex;
      },
      width: ({chart}: ScriptableContext<'matrix'>) =>
        chart.chartArea.width / props.weekData.weekStarts.length - 1,
      height: ({chart}: ScriptableContext<'matrix'>) =>
        chart.chartArea.height / Object.values(Category).length - 1,
    },
  ];

  return {
    datasets,
    accessibleData: {
      rowHeaders: Object.values(Category).map((category) => t(`categories.${category}`)),
      data: Object.values(groupByProp(datasets[0]!.data, 'rawData')).map((items) =>
        items.map(({v}) => `${Math.round(((v || 0) / 6) * 100)} %`),
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
      labels: props.weekData.labels,
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
        title: ([{raw}]) => {
          const {weekIndex} = raw as MatrixDataPoint;
          return props.weekData.weekStrings[weekIndex];
        },
        label: ({raw}) => {
          const {v, rawData} = raw as MatrixDataPoint;
          return `${t(`categories.${rawData}`)}: ${v}`;
        },
      },
    },
  },
});

defineExpose({chartData});
</script>
<template>
  <div ref="chartContainer" class="has-scroll has-scroll--flush">
    <div
      :style="{width: `max(100%, ${weekData.weekStarts.length * 60}px)`}"
      class="relative h-full"
    >
      <HeatmapChart
        id="weekly-heatmap"
        :options="chartOptions"
        :data="chartData"
        :aria-label="$t('stats.weeklyHeatmap')"
        :aria-description="$t('general.seeTableBelow')"
        data-test-id="weekly-heatmap"
      />
    </div>
    <MatrixScreenReaderTable
      :title="$t('stats.weeklyHeatmap')"
      :columnHeaders="weekData.labels"
      :rowHeaders="chartData.accessibleData.rowHeaders"
      :data="chartData.accessibleData.data"
      data-test-id="weekly-heatmap-table"
    />
  </div>
</template>
