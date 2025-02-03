<script lang="ts" setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip} from 'chart.js';
import {Bar} from 'vue-chartjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {prop} from 'remeda';
import {useActivityStore} from '@/stores/activityStore';
import {COLORS} from '@/utils/constants';
import {Category} from '@/utils/types';
import {getCategoryForVeggie, getChartOptions} from '@/utils/helpers';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';
import {useMouse} from '@vueuse/core';

ChartJS.defaults.font.family = 'Nunito';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, ChartDataLabels);

const {t} = useI18n();

const {x: mouseX} = useMouse();

const {veggiesForWeek, getWeekStarts} = storeToRefs(useActivityStore());

const chartData = computed(() => {
  const datasets = Object.values(Category).map((category, index) => ({
    label: category,
    data: getWeekStarts.value.map(
      (weekStart) =>
        veggiesForWeek
          .value(weekStart)
          .filter((veggie) => getCategoryForVeggie(veggie) === category).length,
    ),
    backgroundColor: COLORS.chartColorsAlternate[index],
  }));

  return {
    labels: getWeekStarts.value.map((weekStart) => weekStart.toFormat('W/kkkk')),
    datasets: datasets.filter(({data}) => data.some((value) => value)),
  };
});

const chartOptions = computed(() =>
  getChartOptions<'bar'>(true, true, true, {
    layout: {
      padding: {
        right: 25,
      },
    },
    plugins: {
      tooltip: {
        yAlign: 'bottom',
        xAlign: () => (mouseX.value < window.innerWidth / 2 ? 'left' : 'right'),
        callbacks: {
          label: ({dataset, formattedValue}) => {
            return `${t(`categories.${dataset.label}`)}: ${formattedValue}`;
          },
        },
      },
    },
  }),
);

defineExpose({chartData});
</script>
<template>
  <ContentElement
    :title="$t('stats.weeklyCategories')"
    :labelAttrs="{'aria-hidden': true}"
    class="flex-1 overflow-hidden"
  >
    <div class="h-full has-scroll m-0 p-0">
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
        :rowHeaders="chartData.datasets.map(prop('label'))"
        :data="chartData.datasets.map(prop('data'))"
      />
    </div>
  </ContentElement>
</template>
