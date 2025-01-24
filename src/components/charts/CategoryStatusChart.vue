<script setup lang="ts">
import {computed, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useElementSize} from '@vueuse/core';
import {Chart as ChartJS, ArcElement, Tooltip} from 'chart.js';
import {Doughnut} from 'vue-chartjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {countBy, entries, pipe, prop, sortBy} from 'remeda';
import {Category, type Favorites} from '@/utils/types';
import {CATEGORY_EMOJI, COLORS} from '@/utils/constants';
import {getCategoryForVeggie, getChartOptions} from '@/utils/helpers';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';

ChartJS.defaults.font.family = 'Nunito';
ChartJS.register(ArcElement, Tooltip, ChartDataLabels);

const props = withDefaults(
  defineProps<{
    veggies: string[];
    totals?: boolean;
    favorites?: Favorites;
  }>(),
  {
    totals: false,
    favorites: () => ({}) as Favorites,
  },
);

const {t} = useI18n();

const container = ref<HTMLDivElement | null>(null);
const {height} = useElementSize(container);

const medalEmojis = ['🥇', '🥈', '🥉', '🕓', '🕔'];
const getFavorites = (category: Category) =>
  props.favorites[category].map(([veggie, amount], index) => {
    let translation = t(`veggies.${veggie}`);
    translation = translation.charAt(0).toUpperCase() + translation.slice(1);
    return t('categoryStatus.entry', [medalEmojis[index], translation, amount]);
  });

const chartData = computed(() => {
  const veggies = pipe(props.veggies, countBy(getCategoryForVeggie), entries(), sortBy(prop(1)));

  return {
    labels: veggies.map(prop(0)),
    datasets: [
      {
        data: veggies.map(prop(1)),
        backgroundColor: [...(props.totals ? COLORS.chartColorsAlternate : COLORS.chartColors)],
      },
    ],
  };
});

const chartOptions = computed(() =>
  getChartOptions<'doughnut'>(false, false, true, {
    cutout: height.value < 280 ? '60%' : undefined,
    plugins: {
      tooltip: {
        callbacks: {
          title: ([{label}]) => t(`categories.${label}`),
          footer: props.totals ? ([{label}]) => [...getFavorites(label as Category)] : undefined,
        },
      },
      datalabels: {
        formatter: (_, context) =>
          CATEGORY_EMOJI[context.chart.data.labels![context.dataIndex] as Category],
      },
    },
  }),
);

defineExpose({chartData});
</script>
<template>
  <div ref="container" class="category-status-chart__background">
    <Doughnut
      :data="chartData"
      :options="chartOptions"
      aria-labelledby="category-status-chart-center-label"
      aria-describedby="category-status-table"
      data-test-id="category-status-chart"
    />
    <i18n-t
      id="category-status-chart-center-label"
      scope="global"
      keypath="categoryStatus.centerLabel"
      tag="div"
      class="category-status-chart__center-label"
      data-test-id="category-status-chart-center-label"
    >
      <span>{{ $t(totals ? 'categoryStatus.topLabelTotal' : 'categoryStatus.topLabel') }}</span>
      <span :class="totals ? 'text-5xl' : 'text-6xl'">{{ veggies.length }}</span>
      <span>{{
        $t(totals ? 'categoryStatus.bottomLabelTotal' : 'categoryStatus.bottomLabel')
      }}</span>
    </i18n-t>
    <ChartScreenReaderTable
      id="category-status-table"
      :title="totals ? $t('categoryStatus.veggiesTotal') : $t('categoryStatus.veggiesOfTheWeek')"
      :columnHeaders="chartData.labels.map((category) => t(`categories.${category}`))"
      :data="[chartData.datasets[0].data]"
    />
  </div>
</template>
<style scoped>
:deep(canvas) {
  @apply relative z-10;
}

.category-status-chart__background {
  @apply relative max-h-[50%] min-h-0 aspect-square;
  @apply flex justify-center;
}

.category-status-chart__center-label {
  @apply flex flex-col items-center justify-center;
  @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 label-like;
}
</style>
