<script lang="ts" setup>
import {computed, useTemplateRef} from 'vue';
import {storeToRefs} from 'pinia';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';
import {Line} from 'vue-chartjs';
import ChartAnnotation from 'chartjs-plugin-annotation';
import {mean} from 'remeda';
import {useDateTime} from '@/hooks/dateTime';
import {useChartContainer} from '@/hooks/chartContainer';
import {useActivityStore} from '@/stores/activityStore';
import {COLORS} from '@/utils/constants';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';
import {useChartOptions} from '@/hooks/chartOptions';

ChartJS.defaults.font.family = 'Nunito';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, ChartAnnotation);

const {veggiesForWeek, getWeekStarts} = storeToRefs(useActivityStore());

const chartContainer = useTemplateRef('chartContainer');
const {xAlign, yAlign} = useChartContainer(chartContainer);

const {formatWeekString, formatWeekNumber} = useDateTime();

const chartData = computed(() => {
  const weekStarts = getWeekStarts.value.slice().reverse();
  return {
    labels: weekStarts.map(formatWeekNumber),
    datasets: [
      {
        data: weekStarts.map((weekStart) => veggiesForWeek.value(weekStart).length),
        borderColor: COLORS.chartColorsAlternate[2],
        backgroundColor: COLORS.chartColorsAlternate[2],
      },
    ],
  };
});

const {chartOptions} = useChartOptions<'line'>(true, false, false, {
  plugins: {
    annotation: {
      annotations: {
        mean: {
          type: 'line',
          borderColor: COLORS.chartColorsAlternate[2],
          borderDash: [2, 6],
          borderDashOffset: 0,
          borderWidth: 3,
          scaleID: 'y',
          value: (ctx) => mean(ctx.chart.data.datasets[0]!.data.slice(1) as number[]) ?? 0,
        },
      },
    },
    tooltip: {
      yAlign,
      xAlign,
      callbacks: {
        title: ([tooltip]) => {
          const reversedIndex = getWeekStarts.value.length - 1 - tooltip!.dataIndex!;
          const weekStart = getWeekStarts.value[reversedIndex];
          return formatWeekString(weekStart!);
        },
      },
    },
  },
  layout: {
    padding: {
      right: 25,
    },
  },
  elements: {
    point: {
      hitRadius: 15,
    },
  },
});

defineExpose({chartData});
</script>
<template>
  <ContentElement
    :title="$t('stats.weeklyAmounts')"
    :labelAttrs="{'aria-hidden': true}"
    class="flex-1 overflow-hidden"
  >
    <div ref="chartContainer" class="h-full has-scroll m-0 p-0">
      <div :style="{width: `max(100%, ${getWeekStarts.length * 60}px)`}" class="relative h-full">
        <Line
          :options="chartOptions"
          :data="chartData"
          :aria-label="$t('stats.weeklyAmounts')"
          aria-describedby="weekly-amounts-table"
          data-test-id="weekly-amounts-chart"
        />
      </div>
      <ChartScreenReaderTable
        id="weekly-amounts-table"
        :title="$t('stats.weeklyAmounts')"
        :columnHeaders="chartData.labels"
        :data="chartData.datasets.map(({data}) => data)"
      />
    </div>
  </ContentElement>
</template>
