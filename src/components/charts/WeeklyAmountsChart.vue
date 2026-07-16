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
import ChartAnnotation from 'chartjs-plugin-annotation';
import {mean} from 'remeda';
import {useI18n} from 'vue-i18n';
import {useChartContainer} from '@/hooks/chartContainer';
import {useChartOptions} from '@/hooks/chartOptions';
import {useCssColors} from '@/hooks/cssColors';
import {useActivityStore} from '@/stores/activityStore';
import {type WeeklyChartData} from '@/types';
import {standardDeviation} from '@/utils/helpers';

ChartJS.defaults.font.family = 'Nunito';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, ChartAnnotation);

const props = defineProps<{
  weekData: WeeklyChartData;
}>();

const {t} = useI18n();
const {veggiesForWeek} = storeToRefs(useActivityStore());

const chartContainer = useTemplateRef('chartContainer');
const {xAlign, yAlign} = useChartContainer(chartContainer);
const [primaryColor, textColor] = useCssColors(['--color-primary', '--color-text']);

const chartData = computed(() => {
  const data = props.weekData.weekStarts.map((weekStart) => veggiesForWeek.value(weekStart).length);

  return {
    datasets: [
      {
        data,
        borderColor: primaryColor.value,
        backgroundColor: primaryColor.value,
        tension: 0.4,
      },
    ],
    labels: props.weekData.labels,
    accessibleData: {
      data,
    },
  };
});

const {chartOptions} = useChartOptions<'line'>(
  true,
  false,
  false,
  computed(() => {
    const meanValue = mean(chartData.value.datasets[0].data as number[]) ?? 0;
    const stdDev = standardDeviation(chartData.value.datasets[0].data as number[]);
    return {
      plugins: {
        annotation: {
          annotations: {
            stdDevBand: {
              type: 'box',
              backgroundColor: primaryColor.value + '20',
              borderWidth: 0,
              yMin: () => meanValue - stdDev,
              yMax: () => meanValue + stdDev,
              scaleID: 'y',
              adjustScaleRange: false,
            },
            mean: {
              type: 'line',
              borderColor: primaryColor.value,
              borderDash: [2, 6],
              borderDashOffset: 0,
              borderWidth: 3,
              scaleID: 'y',
              value: () => meanValue,
              label: {
                display: true,
                color: textColor.value,
                backgroundColor: 'transparent',
                font: {
                  weight: 'normal',
                  size: 14,
                },
                content: t('stats.mean', [meanValue.toFixed(1)]),
                position: 'end',
                yAdjust: 20,
                xAdjust: -20,
              },
            },
          },
        },
        tooltip: {
          yAlign,
          xAlign,
          callbacks: {
            title: ([{dataIndex}]) => props.weekData.weekStrings[dataIndex],
          },
        },
      },
      elements: {
        point: {
          hitRadius: 15,
        },
      },
    };
  }),
);

defineExpose({chartData});
</script>
<template>
  <div ref="chartContainer" class="has-scroll has-scroll--flush">
    <div
      :style="{width: `max(100%, ${weekData.weekStarts.length * 60}px)`}"
      class="relative h-full"
    >
      <Line
        id="weekly-amounts-chart"
        :options="chartOptions"
        :data="chartData"
        :aria-label="$t('stats.weeklyAmounts')"
        :aria-description="$t('general.seeTableBelow')"
        data-test-id="weekly-amounts-chart"
      />
    </div>
    <SimpleScreenReaderTable
      :title="$t('stats.weeklyAmounts')"
      :columnHeaders="weekData.labels"
      :data="chartData.accessibleData.data"
      data-test-id="weekly-amounts-table"
    />
  </div>
</template>
