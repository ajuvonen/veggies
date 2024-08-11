<script lang="ts" setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from 'chart.js';
import {Line} from 'vue-chartjs';
import {prop, takeLast} from 'remeda';
import {useActivityStore} from '@/stores/activityStore';
import {getChartOptions} from '@/utils/helpers';
import useDateTime from '@/hooks/dateTime';
import {COLORS} from '@/utils/constants';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Title);

const {t} = useI18n();

const {veggiesForWeek, startDate} = storeToRefs(useActivityStore());

const {getWeekStarts} = useDateTime();

const chartData = computed(() => {
  const weekRange = takeLast(getWeekStarts.value, 5);
  return {
    labels: weekRange.map((weekStart) =>
      t('stats.week', [weekStart.diff(startDate.value!, 'weeks').weeks + 1]),
    ),
    datasets: [
      {
        data: weekRange.map((weekStart) => veggiesForWeek.value(weekStart).length),
        borderColor: COLORS.chartColorsAlternate[2],
        backgroundColor: COLORS.chartColorsAlternate[2],
      },
    ],
  };
});

const chartOptions = computed(() => {
  const defaultChartOptions = getChartOptions<'line'>(t('stats.weeklyAmounts'), true, false);
  return {
    ...defaultChartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
    },
  };
});

defineExpose({chartData});
</script>
<template>
  <div class="chart-background">
    <Line
      :options="chartOptions"
      :data="chartData"
      data-test-id="weekly-amounts-chart"
      aria-describedby="weekly-amounts-chart-table"
    />
    <ChartScreenReaderTable
      id="weekly-amounts-chart-table"
      :title="$t('stats.weeklyAmounts')"
      :columnHeaders="chartData.labels"
      :data="chartData.datasets.map(prop('data'))"
    />
  </div>
</template>
