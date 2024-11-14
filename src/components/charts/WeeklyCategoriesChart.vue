<script lang="ts" setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
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
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';

ChartJS.defaults.font.family = 'Nunito';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);
ChartJS.register(ChartDataLabels);

const {t} = useI18n();

const {veggiesForWeek, getWeekStarts} = storeToRefs(useActivityStore());

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
      t('stats.week', [weekStart.diff(getWeekStarts.value[0], 'weeks').weeks + 1]),
    ),
    datasets: datasets.filter(({data}) => data.some((value) => value)),
  };
});

const chartOptions = computed(() => {
  const defaultOptions = getChartOptions<'bar'>(true, true, true);
  return {
    ...defaultOptions,
    plugins: {
      ...defaultOptions.plugins,
      tooltip: {
        ...defaultOptions.plugins?.tooltip,
        callbacks: {
          label: ({dataset, formattedValue}) => {
            return `${t(`categories.${dataset.label}`)}: ${formattedValue}`;
          },
        },
      },
    },
  } as ChartOptions<'bar'>;
});

defineExpose({chartData});
</script>
<template>
  <ContentElement :title="$t('stats.weeklyCategories')" :labelAttrs="{'aria-hidden': true}">
    <div class="relative flex-1">
      <Bar
        :options="chartOptions"
        :data="chartData"
        data-test-id="weekly-categories-chart"
        aria-describedby="weekly-categories-table"
      />
      <ChartScreenReaderTable
        id="weekly-categories-table"
        :title="$t('stats.0')"
        :columnHeaders="chartData.labels"
        :rowHeaders="chartData.datasets.map(prop('label'))"
        :data="chartData.datasets.map(prop('data'))"
      />
    </div>
  </ContentElement>
</template>
