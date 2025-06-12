<script lang="ts" setup>
import {computed, ref} from 'vue';
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
import {mean, reverse} from 'remeda';
import {DateTime} from 'luxon';
import {useDateTime} from '@/hooks/dateTime';
import {useChartContainer} from '@/hooks/chartContainer';
import {useChartAnimations} from '@/hooks/chartAnimations';
import {useActivityStore} from '@/stores/activityStore';
import {getChartOptions} from '@/utils/helpers';
import {COLORS} from '@/utils/constants';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';

ChartJS.defaults.font.family = 'Nunito';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, ChartAnnotation);

const {veggiesForWeek, getWeekStarts} = storeToRefs(useActivityStore());
const {showChartAnimations} = useChartAnimations();

const chartContainer = ref<HTMLDivElement | null>(null);
const {xAlign, yAlign} = useChartContainer(chartContainer);

const {formatWeekString} = useDateTime();

const chartData = computed(() => {
  const weekStarts = reverse(getWeekStarts.value);
  return {
    labels: weekStarts.map((weekStart) => weekStart.toFormat('W/kkkk')),
    datasets: [
      {
        data: weekStarts.map((weekStart) => veggiesForWeek.value(weekStart).length),
        borderColor: COLORS.chartColorsAlternate[2],
        backgroundColor: COLORS.chartColorsAlternate[2],
      },
    ],
  };
});

const chartOptions = computed(() =>
  getChartOptions<'line'>(true, false, false, showChartAnimations.value, {
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
            value: (ctx) => mean(ctx.chart.data.datasets[0].data.slice(1) as number[]) ?? 0,
          },
        },
      },
      tooltip: {
        yAlign,
        xAlign,
        callbacks: {
          title: (data) => {
            const weekStart = DateTime.fromFormat(data[0].label, 'W/kkkk');
            return formatWeekString(weekStart);
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
  }),
);

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
          data-test-id="weekly-amounts-chart"
          aria-describedby="weekly-amounts-table"
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
