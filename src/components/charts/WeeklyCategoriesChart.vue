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
import {prop, range} from 'remeda';
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
  const weekRange = range(Math.max(getTotalWeeks.value - 5, 0), getTotalWeeks.value);
  const datasets = Object.values(Category).map((category, index) => ({
    label: t(`categories.${category}`),
    data: weekRange.map(
      (weekIndex) =>
        veggiesForWeek
          .value(weekIndex)
          .filter((veggie) => getCategoryForVeggie(veggie) === category).length,
    ),
    backgroundColor: COLORS.chartColorsAlternate[index],
  }));

  return {
    labels: weekRange.map((weekIndex) => t('stats.week', [weekIndex + 1])),
    datasets: datasets.filter(({data}) => data.some((value) => value)),
  };
});

const chartOptions = computed(() =>
  getChartOptions<'bar'>(t('stats.weeklyCategories'), true, true),
);

defineExpose({chartData});
</script>
<template>
  <div class="chart-background">
    <Bar
      :options="chartOptions"
      :data="chartData"
      data-test-id="weekly-categories-chart"
      aria-describedby="weekly-categories-chart-table"
    />
    <ChartScreenReaderTable
      id="weekly-categories-chart-table"
      :title="$t('stats.0')"
      :columnHeaders="chartData.labels"
      :rowHeaders="chartData.datasets.map(prop('label'))"
      :data="chartData.datasets.map(prop('data'))"
    />
  </div>
</template>
