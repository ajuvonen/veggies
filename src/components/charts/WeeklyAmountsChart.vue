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
import type {DateTime} from 'luxon';
import {useDateTime} from '@/hooks/dateTime';
import {useChartContainer} from '@/hooks/chartContainer';
import {useChartOptions} from '@/hooks/chartOptions';
import {useActivityStore} from '@/stores/activityStore';
import {COLORS} from '@/utils/constants';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';

ChartJS.defaults.font.family = 'Nunito';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, ChartAnnotation);

const props = defineProps<{
  labels: string[];
  weekStarts: DateTime[];
}>();

const {veggiesForWeek} = storeToRefs(useActivityStore());

const chartContainer = useTemplateRef('chartContainer');
const {xAlign, yAlign} = useChartContainer(chartContainer);

const {formatWeekString} = useDateTime();

const chartData = computed(() => {
  const data = props.weekStarts.map((weekStart) => veggiesForWeek.value(weekStart).length);

  return {
    datasets: [
      {
        data,
        borderColor: COLORS.chartColorsAlternate[2],
        backgroundColor: COLORS.chartColorsAlternate[2],
      },
    ],
    labels: props.labels,
    accessibleData: {
      data,
    },
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
          value: (ctx) => mean(ctx.chart.data.datasets[0]!.data as number[]) ?? 0,
        },
      },
    },
    tooltip: {
      yAlign,
      xAlign,
      callbacks: {
        title: ([tooltip]) => {
          const weekStart = props.weekStarts[tooltip!.dataIndex!];
          return formatWeekString(weekStart!);
        },
      },
    },
  },
  layout: {
    padding: {
      right: 5,
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
  <div ref="chartContainer" class="has-scroll m-0 p-0">
    <div :style="{width: `max(100%, ${weekStarts.length * 60}px)`}" class="relative h-full">
      <Line
        id="weekly-amounts-chart"
        :options="chartOptions"
        :data="chartData"
        :aria-label="$t('stats.weeklyAmounts')"
        :aria-description="$t('general.seeTableBelow')"
        data-test-id="weekly-amounts-chart"
      />
    </div>
    <ChartScreenReaderTable
      :title="$t('stats.weeklyAmounts')"
      :columnHeaders="labels"
      :data="chartData.accessibleData.data"
      data-test-id="weekly-amounts-table"
    />
  </div>
</template>
