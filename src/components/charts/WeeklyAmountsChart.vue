<script lang="ts" setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import {Line} from 'vue-chartjs';
import ChartAnnotation, {type EventContext} from 'chartjs-plugin-annotation';
import {mean, prop} from 'remeda';
import {useActivityStore} from '@/stores/activityStore';
import {getChartOptions} from '@/utils/helpers';
import {COLORS} from '@/utils/constants';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';

ChartJS.defaults.font.family = 'Nunito';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, ChartAnnotation);

const {veggiesForWeek, getWeekStarts} = storeToRefs(useActivityStore());

const chartData = computed(() => {
  return {
    labels: getWeekStarts.value.map((weekStart) => weekStart.toFormat('W/kkkk')),
    datasets: [
      {
        data: getWeekStarts.value.map((weekStart) => veggiesForWeek.value(weekStart).length),
        borderColor: COLORS.chartColorsAlternate[2],
        backgroundColor: COLORS.chartColorsAlternate[2],
      },
    ],
  };
});

const chartOptions = computed(() => {
  const defaultChartOptions = getChartOptions<'line'>(true, false);
  return {
    ...defaultChartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      annotation: {
        annotations: {
          mean: {
            type: 'line',
            borderColor: COLORS.chartColorsAlternate[2],
            borderDash: [2, 6],
            borderDashOffset: 0,
            borderWidth: 3,
            scaleID: 'y',
            value: (ctx: EventContext) =>
              mean(ctx.chart.data.datasets[0].data.slice(1) as number[]) ?? 0,
          },
        },
      },
    },
    layout: {
      padding: {
        right: 25,
      },
    },
  };
});

defineExpose({chartData});
</script>
<template>
  <ContentElement
    :title="$t('stats.weeklyAmounts')"
    :labelAttrs="{'aria-hidden': true}"
    class="flex-1 overflow-hidden"
  >
    <div class="h-full overflow-x-scroll has-scroll">
      <div :style="{width: `max(100%, ${getWeekStarts.length * 55}px)`}" class="relative h-full">
        <Line
          :options="chartOptions as ChartOptions<'line'>"
          :data="chartData"
          data-test-id="weekly-amounts-chart"
          aria-describedby="weekly-amounts-table"
        />
      </div>
      <ChartScreenReaderTable
        id="weekly-amounts-table"
        :title="$t('stats.weeklyAmounts')"
        :columnHeaders="chartData.labels"
        :data="chartData.datasets.map(prop('data'))"
      />
    </div>
  </ContentElement>
</template>
