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
  Tooltip,
} from 'chart.js';
import {Line} from 'vue-chartjs';
import {prop, takeLast} from 'remeda';
import {useActivityStore} from '@/stores/activityStore';
import {getChartOptions} from '@/utils/helpers';
import {COLORS} from '@/utils/constants';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';

ChartJS.defaults.font.family = 'Nunito';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const {t} = useI18n();

const {veggiesForWeek, getWeekStarts} = storeToRefs(useActivityStore());

const chartData = computed(() => {
  const weekRange = takeLast(getWeekStarts.value, 5);
  return {
    labels: weekRange.map((weekStart) =>
      t('stats.week', [weekStart.diff(getWeekStarts.value[0], 'weeks').weeks + 1]),
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
  const defaultChartOptions = getChartOptions<'line'>(true, false);
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
  <ContentElement :title="$t('stats.weeklyAmounts')" :ariaHidden="true">
    <div class="relative flex-1">
      <Line
        :options="chartOptions"
        :data="chartData"
        data-test-id="weekly-amounts-chart"
        aria-describedby="weekly-amounts-table"
      />
      <ChartScreenReaderTable
        id="weekly-amounts-table"
        :title="$t('stats.weeklyAmounts')"
        :columnHeaders="chartData.labels"
        :data="chartData.datasets.map(prop('data'))"
      />
    </div>
  </ContentElement>
</template>
