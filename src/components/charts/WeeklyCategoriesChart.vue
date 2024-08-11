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
  type ChartOptions,
} from 'chart.js';
import {Bar} from 'vue-chartjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {prop, takeLast} from 'remeda';
import {useActivityStore} from '@/stores/activityStore';
import {COLORS} from '@/utils/constants';
import {Category} from '@/utils/types';
import {getCategoryForVeggie, getChartOptions} from '@/utils/helpers';
import useDateTime from '@/hooks/dateTime';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);
ChartJS.register(ChartDataLabels);

const {t} = useI18n();

const {veggiesForWeek, startDate} = storeToRefs(useActivityStore());

const {getWeekStarts} = useDateTime();

const chartData = computed(() => {
  const weekRange = takeLast(getWeekStarts.value, 5);
  const datasets = Object.values(Category).map((category, index) => ({
    label: category,
    data: weekRange.map(
      (weekStart) =>
        veggiesForWeek
          .value(weekStart)
          .filter((veggie) => getCategoryForVeggie(veggie) === category).length,
    ),
    backgroundColor: COLORS.chartColorsAlternate[index],
  }));

  return {
    labels: weekRange.map((weekStart) =>
      t('stats.week', [weekStart.diff(startDate.value!, 'weeks').weeks + 1]),
    ),
    datasets: datasets.filter(({data}) => data.some((value) => value)),
  };
});

const chartOptions = computed(() => {
  const defaultOptions = getChartOptions<'bar'>(t('stats.weeklyCategories'), true, true, true);
  return {
    ...defaultOptions,
    plugins: {
      ...defaultOptions.plugins,
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${t(`categories.${context.dataset.label}`)} ${context.raw}`;
          },
        },
        boxPadding: 5,
      },
    },
  } as ChartOptions<'bar'>;
});

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
