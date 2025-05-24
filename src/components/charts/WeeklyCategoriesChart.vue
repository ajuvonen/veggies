<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip} from 'chart.js';
import {Bar} from 'vue-chartjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {reverse} from 'remeda';
import {DateTime} from 'luxon';
import {useDateTime} from '@/hooks/dateTime';
import {useChartContainer} from '@/hooks/chartContainer';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import {COLORS} from '@/utils/constants';
import {Category} from '@/utils/types';
import {getCategoryForVeggie, getChartOptions} from '@/utils/helpers';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';

ChartJS.defaults.font.family = 'Nunito';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, ChartDataLabels);

const {t} = useI18n();

const {veggiesForWeek, getWeekStarts} = storeToRefs(useActivityStore());
const {settings} = storeToRefs(useAppStateStore());

const {formatWeekString} = useDateTime();

const chartContainer = ref<HTMLDivElement | null>(null);
const {xAlign, yAlign} = useChartContainer(chartContainer);

const chartData = computed(() => {
  const weekStarts = reverse(getWeekStarts.value);
  const datasets = Object.values(Category).map((category, index) => ({
    label: category,
    data: weekStarts.map(
      (weekStart) =>
        veggiesForWeek
          .value(weekStart)
          .filter((veggie) => getCategoryForVeggie(veggie) === category).length,
    ),
    backgroundColor: COLORS.chartColorsAlternate[index],
  }));

  return {
    labels: weekStarts.map((weekStart) => weekStart.toFormat('W/kkkk')),
    datasets: datasets.filter(({data}) => data.some((value) => value)),
  };
});

const chartOptions = computed(() =>
  getChartOptions<'bar'>(true, true, true, settings.value.disableAnimations, {
    layout: {
      padding: {
        right: 25,
      },
    },
    plugins: {
      tooltip: {
        xAlign,
        yAlign,
        callbacks: {
          title: (data) => {
            const weekStart = DateTime.fromFormat(data[0].label, 'W/kkkk');
            return formatWeekString(weekStart);
          },
          label: ({dataset, formattedValue}) => {
            return `${t(`categories.${dataset.label}`)}: ${formattedValue}`;
          },
        },
      },
    },
  }),
);

onMounted(() => {
  if (chartContainer.value) {
    chartContainer.value.scrollLeft = chartContainer.value.scrollWidth;
  }
});

defineExpose({chartData});
</script>
<template>
  <ContentElement
    :title="$t('stats.weeklyCategories')"
    :labelAttrs="{'aria-hidden': true}"
    class="flex-1 overflow-hidden"
  >
    <div ref="chartContainer" class="h-full has-scroll m-0 p-0">
      <div :style="{width: `max(100%, ${getWeekStarts.length * 60}px)`}" class="relative h-full">
        <Bar
          :options="chartOptions"
          :data="chartData"
          data-test-id="weekly-categories-chart"
          aria-describedby="weekly-categories-table"
        />
      </div>
      <ChartScreenReaderTable
        id="weekly-categories-table"
        :title="$t('stats.weeklyCategories')"
        :columnHeaders="chartData.labels"
        :rowHeaders="chartData.datasets.map(({label}) => t(`categories.${label}`))"
        :data="chartData.datasets.map(({data}) => data)"
      />
    </div>
  </ContentElement>
</template>
