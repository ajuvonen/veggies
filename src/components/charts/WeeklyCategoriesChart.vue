<script lang="ts" setup>
import {computed, onMounted, useTemplateRef} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip} from 'chart.js';
import {Bar} from 'vue-chartjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type {DateTime} from 'luxon';
import {useDateTime} from '@/hooks/dateTime';
import {useChartContainer} from '@/hooks/chartContainer';
import {useActivityStore} from '@/stores/activityStore';
import {COLORS} from '@/utils/constants';
import {Category} from '@/types';
import {getCategoryForVeggie} from '@/utils/helpers';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';
import {useChartOptions} from '@/hooks/chartOptions';

ChartJS.defaults.font.family = 'Nunito';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, ChartDataLabels);

const props = defineProps<{
  labels: string[];
  weekStarts: DateTime[];
}>();

const {t} = useI18n();

const {veggiesForWeek} = storeToRefs(useActivityStore());

const {formatWeekString} = useDateTime();

const chartContainer = useTemplateRef('chartContainer');
const {xAlign, yAlign} = useChartContainer(chartContainer);

const chartData = computed(() => {
  const datasets = Object.values(Category).map((category, index) => ({
    label: category,
    data: props.weekStarts.map(
      (weekStart) =>
        veggiesForWeek
          .value(weekStart)
          .filter((veggie) => getCategoryForVeggie(veggie) === category).length,
    ),
    backgroundColor: COLORS.chartColorsAlternate[index],
  }));

  return {
    datasets,
    labels: props.labels,
    accessibleData: {
      rowHeaders: datasets.map(({label}) => t(`categories.${label}`)),
      data: datasets.map(({data}) => data),
    },
  };
});

const {chartOptions} = useChartOptions<'bar'>(true, true, true, {
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
        title: ([tooltip]) => {
          const weekStart = props.weekStarts[tooltip!.dataIndex!];
          return formatWeekString(weekStart!);
        },
        label: ({dataset, formattedValue}) => {
          return `${t(`categories.${dataset.label}`)}: ${formattedValue}`;
        },
      },
    },
  },
});

onMounted(() => {
  if (chartContainer.value) {
    chartContainer.value.scrollLeft = chartContainer.value.scrollWidth;
  }
});

defineExpose({chartData});
</script>
<template>
  <div ref="chartContainer" class="has-scroll m-0 p-0">
    <div :style="{width: `max(100%, ${props.weekStarts.length * 60}px)`}" class="relative h-full">
      <Bar
        id="weekly-categories-chart"
        :options="chartOptions"
        :data="chartData"
        :aria-label="$t('stats.weeklyCategories')"
        :aria-description="$t('general.seeTableBelow')"
        data-test-id="weekly-categories-chart"
      />
    </div>
    <ChartScreenReaderTable
      :title="$t('stats.weeklyCategories')"
      :columnHeaders="labels"
      :rowHeaders="chartData.accessibleData.rowHeaders"
      :data="chartData.accessibleData.data"
      data-test-id="weekly-categories-table"
    />
  </div>
</template>
