<script setup lang="ts">
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {Chart as ChartJS, Tooltip, RadialLinearScale, ArcElement} from 'chart.js';
import {PolarArea} from 'vue-chartjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {countBy} from 'remeda';
import {Category} from '@/utils/types';
import {CATEGORY_EMOJI, COLORS} from '@/utils/constants';
import {getCategoryForVeggie} from '@/utils/helpers';
import {useAvailableVeggies} from '@/hooks/availableVeggies';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';
import {useChartOptions} from '@/hooks/chartOptions';

ChartJS.defaults.font.family = 'Nunito';
ChartJS.register(Tooltip, RadialLinearScale, ArcElement, ChartDataLabels);

const props = defineProps<{
  veggies: string[];
}>();

const {t} = useI18n();

const {
  availableFruits,
  availableVegetables,
  availableLeafies,
  availableRoots,
  availableBeans,
  availableGrains,
  availableMushrooms,
} = useAvailableVeggies();

const veggieLengths = computed<Record<Category, number>>(() => ({
  [Category.Fruit]: availableFruits.value.length,
  [Category.Vegetable]: availableVegetables.value.length,
  [Category.Leafy]: availableLeafies.value.length,
  [Category.Root]: availableRoots.value.length,
  [Category.Bean]: availableBeans.value.length,
  [Category.Grain]: availableGrains.value.length,
  [Category.Mushroom]: availableMushrooms.value.length,
}));

const chartData = computed(() => {
  const groupedVeggies = countBy(props.veggies, getCategoryForVeggie);
  const veggies: [Category, number][] = Object.values(Category).map((category) => [
    category,
    Math.round(((groupedVeggies[category] || 0) / veggieLengths.value[category]) * 100),
  ]);

  return {
    labels: veggies.map(([category]) => category),
    datasets: [
      {
        data: veggies.map(([, percentage]) => percentage),
        backgroundColor: COLORS.chartColorsAlternate,
      },
    ],
  };
});

const {chartOptions} = useChartOptions<'polarArea'>(false, false, false, {
  plugins: {
    tooltip: {
      callbacks: {
        title: ([tooltip]) => t(`categories.${tooltip!.label}`),
        label: ({formattedValue}) => t('veggieList.chartLabel', [formattedValue]),
      },
    },
    datalabels: {
      display: true,
      color: getComputedStyle(document.documentElement).getPropertyValue('--color-text'),
      formatter: (value) => `${value} %`,
      anchor: 'end',
      align: 'end',
    },
  },
  scales: {
    r: {
      beginAtZero: true,
      max: Math.max(...chartData.value.datasets[0]!.data) + 20,
      ticks: {
        count: 5,
        display: false,
      },
      pointLabels: {
        display: true,
        centerPointLabels: true,
        font: {
          size: 25,
        },
        callback: (value) => CATEGORY_EMOJI[value as Category],
      },
    },
  },
});

defineExpose({chartData});
</script>
<template>
  <ContentElement :title="$t('veggieList.chartTitle')" :labelAttrs="{'aria-hidden': true}">
    <div class="veggie-completion-chart__background">
      <PolarArea
        :data="chartData"
        :options="chartOptions"
        data-test-id="veggie-completion-chart"
        aria-describedby="veggie-completion-table"
      />
      <ChartScreenReaderTable
        id="veggie-completion-table"
        :title="$t('veggieList.chartTitle')"
        :columnHeaders="chartData.labels.map((category) => t(`categories.${category}`))"
        :data="[chartData.datasets[0]!.data.map((value) => `${value} %`)]"
      />
    </div>
  </ContentElement>
</template>
<style scoped>
.veggie-completion-chart__background {
  @apply relative overflow-hidden -my-4 max-h-[50vh];
  @apply flex-1 self-center;
}
</style>
