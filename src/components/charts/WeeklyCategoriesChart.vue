<script lang="ts" setup>
import {computed, useTemplateRef} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {countBy} from 'remeda';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {useChartContainer} from '@/hooks/chartContainer';
import {useChartOptions} from '@/hooks/chartOptions';
import {useCssColors} from '@/hooks/cssColors';
import {CHART_COLORS} from '@/utils/constants';
import {getCategoryForVeggie} from '@/utils/helpers';
import {Category, type WeeklyChartData} from '@/types';
import {useActivityStore} from '@/stores/activityStore';

ChartJS.defaults.font.family = 'Nunito';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, ChartDataLabels);

const props = defineProps<{
  weekData: WeeklyChartData;
}>();

const {t} = useI18n();

const {veggiesForWeek} = storeToRefs(useActivityStore());

const chartContainer = useTemplateRef('chartContainer');
const {xAlign, yAlign} = useChartContainer(chartContainer);
const [textColor] = useCssColors(['--color-text']);

const chartData = computed(() => {
  const countsByWeek = props.weekData.weekStarts.map((weekStart) => {
    const veggies = veggiesForWeek.value(weekStart);
    const counts = countBy(veggies, getCategoryForVeggie);
    return {counts, total: veggies.length};
  });

  const datasets = Object.values(Category).map((category, index) => ({
    label: category,
    data: countsByWeek.map(({counts, total}) => {
      const count = counts[category] ?? 0;
      return total > 0 ? (count / total) * 100 : 0;
    }),
    barPercentage: 1,
    backgroundColor: CHART_COLORS[index],
    borderSkipped: 'middle' as const,
    borderColor: textColor.value,
    borderWidth: 2,
  }));

  return {
    datasets,
    labels: props.weekData.labels,
    accessibleData: {
      rowHeaders: datasets.map(({label}) => t(`categories.${label}`)),
      data: datasets.map(({data}) => data.map((value) => `${Math.round(value)} %`)),
    },
  };
});

const {chartOptions} = useChartOptions<'bar'>(
  true,
  true,
  true,
  computed(() => ({
    scales: {
      y: {
        max: 100,
      },
    },
    plugins: {
      tooltip: {
        xAlign,
        yAlign,
        callbacks: {
          title: ([{dataIndex}]) => props.weekData.weekStrings[dataIndex],
          label: ({dataset, raw}) => {
            return `${t(`categories.${dataset.label}`)}: ${Math.round(Number(raw))} %`;
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
