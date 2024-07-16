<script lang="ts" setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {Bar} from 'vue-chartjs';
import {prop} from 'remeda';
import {useActivityStore} from '@/stores/activityStore';
import {COLORS} from '@/utils/constants';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';
import {Category} from '@/utils/types';
import useDateTime from '@/hooks/dateTime';
import {getCategoryForVeggie, getChartOptions} from '@/utils/helpers';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const {t} = useI18n();

const {veggiesForWeek} = storeToRefs(useActivityStore());

const {getTotalWeeks} = useDateTime();

const chartData = computed(() => {
  const datasets = Object.values(Category).map((category, index) => ({
    label: t(`categories.${category}`),
    data: [...Array(getTotalWeeks.value)].map(
      (_, weekIndex) =>
        veggiesForWeek
          .value(weekIndex)
          .filter((veggie) => getCategoryForVeggie(veggie) === category).length,
    ),
    backgroundColor: COLORS.chartColors[index],
  }));

  return {
    labels: [...Array(getTotalWeeks.value)].map((_, weekIndex) => t('stats.week', [weekIndex + 1])),
    datasets: datasets.filter(({data}) => data.some((value) => value)),
  };
});

const chartOptions = computed(() => getChartOptions<'bar'>(true, true));

defineExpose({chartData});
</script>
<template>
  <Bar
    :options="chartOptions"
    :data="chartData"
    data-test-id="weekly-amounts-chart"
    aria-describedby="weekly-amounts-chart-table"
    class="max-w-lg bg-white rounded-md border-gray-900"
  />
  <ChartScreenReaderTable
    id="weekly-amounts-chart-table"
    :title="$t('stats.weeklyAmounts')"
    :columnHeaders="chartData.labels"
    :rowHeaders="chartData.datasets.map(prop('label'))"
    :data="chartData.datasets.map(prop('data'))"
  />
</template>
<style lang="scss" scoped>
// canvas {
//   background: white;
//   border: 2px solid black;
//   border-radius: 14px;
// }
</style>
