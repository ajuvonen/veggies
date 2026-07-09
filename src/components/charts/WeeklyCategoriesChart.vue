<script lang="ts" setup>
import {computed, useTemplateRef} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {useChartContainer} from '@/hooks/chartContainer';
import {useChartOptions} from '@/hooks/chartOptions';
import {type WeeklyChartData} from '@/types';
import {COLORS} from '@/utils/constants';
import {getCategoryForVeggie} from '@/utils/helpers';
import {useActivityStore} from '@/stores/activityStore';
import {Category} from '@/types';

ChartJS.defaults.font.family = 'Nunito';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, ChartDataLabels);

const props = defineProps<{
  weekData: WeeklyChartData;
}>();

const {t} = useI18n();

const {veggiesForWeek} = storeToRefs(useActivityStore());

const chartContainer = useTemplateRef('chartContainer');
const {xAlign, yAlign} = useChartContainer(chartContainer);

const chartData = computed(() => {
  const datasets = Object.values(Category).map((category, index) => ({
    label: category,
    data: props.weekData.weekStarts.map(
      (weekStart) =>
        veggiesForWeek
          .value(weekStart)
          .filter((veggie) => getCategoryForVeggie(veggie) === category).length,
    ),
    backgroundColor: COLORS.chartColorsAlternate[index],
  }));

  return {
    datasets,
    labels: props.weekData.labels,
    accessibleData: {
      rowHeaders: datasets.map(({label}) => t(`categories.${label}`)),
      data: datasets.map(({data}) => data),
    },
  };
});

const {chartOptions} = useChartOptions<'bar'>(
  true,
  true,
  true,
  computed(() => ({
    layout: {
      padding: {
        right: 5,
      },
    },
    plugins: {
      tooltip: {
        xAlign,
        yAlign,
        callbacks: {
          title: ([{dataIndex}]) => props.weekData.weekStrings[dataIndex],
          label: ({dataset, formattedValue}) => {
            return `${t(`categories.${dataset.label}`)}: ${formattedValue}`;
          },
        },
      },
    },
  })),
);

defineExpose({chartData});
</script>
<template>
  <div ref="chartContainer" class="has-scroll has-scroll--flush">
    <div
      :style="{width: `max(100%, ${weekData.weekStarts.length * 60}px)`}"
      class="relative h-full"
    >
      <Bar
        id="weekly-categories-chart"
        :options="chartOptions"
        :data="chartData"
        :aria-label="$t('stats.weeklyCategories')"
        :aria-description="$t('general.seeTableBelow')"
        data-test-id="weekly-categories-chart"
      />
    </div>
    <MatrixScreenReaderTable
      :title="$t('stats.weeklyCategories')"
      :columnHeaders="weekData.labels"
      :rowHeaders="chartData.accessibleData.rowHeaders"
      :data="chartData.accessibleData.data"
      data-test-id="weekly-categories-table"
    />
  </div>
</template>
