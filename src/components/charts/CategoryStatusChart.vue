<script setup lang="ts">
import {computed, useTemplateRef} from 'vue';
import {useElementSize} from '@vueuse/core';
import {Chart as ChartJS, ArcElement, Tooltip} from 'chart.js';
import {Doughnut} from 'vue-chartjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {countBy, entries, pipe, prop, sortBy} from 'remeda';
import {Category, type Favorites} from '@/utils/types';
import {CATEGORY_EMOJI} from '@/utils/constants';
import {COLORS} from '@/utils/constants';
import {getCategoryForVeggie} from '@/utils/helpers';
import {useI18nWithCollator} from '@/hooks/i18n';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';
import {useChartOptions} from '@/hooks/chartOptions';

ChartJS.defaults.font.family = 'Nunito';
ChartJS.register(ArcElement, Tooltip, ChartDataLabels);

const props = withDefaults(
  defineProps<{
    veggies: string[];
    favorites?: Favorites;
    topLabelKey?: string;
    bottomLabelKey?: string;
    alternateColorScheme?: boolean;
  }>(),
  {
    topLabelKey: 'categoryStatus.topLabel',
    bottomLabelKey: 'categoryStatus.bottomLabel',
    alternateColorScheme: false,
  },
);

const {t, collator} = useI18nWithCollator();

const container = useTemplateRef('container');
const {height} = useElementSize(container);

const medalEmojis = ['🥇', '🥈', '🥉', '🍀', '🖐️', '🕕'];

const translateAndCapitalize = (veggie: string) => {
  const translation = t(`veggies.${veggie}`);
  return translation.charAt(0).toUpperCase() + translation.slice(1);
};

const chartData = computed(() => {
  const veggies = pipe(props.veggies, countBy(getCategoryForVeggie), entries(), sortBy(prop(1)));

  return {
    labels: veggies.map(prop(0)),
    datasets: [
      {
        data: veggies.map(prop(1)),
        backgroundColor: props.alternateColorScheme
          ? COLORS.chartColorsAlternate
          : COLORS.chartColors,
      },
    ],
  };
});

const {chartOptions} = useChartOptions<'doughnut'>(
  false,
  false,
  true,
  computed(() => ({
    cutout: height.value < 280 ? '60%' : undefined,
    plugins: {
      tooltip: {
        callbacks: {
          title: ([tooltip]) => t(`categories.${tooltip!.label}`),
          footer: ([tooltip]) =>
            props.favorites
              ? props.favorites[tooltip!.label as Category].map(([veggie, amount], index) => {
                  const translation = translateAndCapitalize(veggie);
                  return `${medalEmojis[index]} ${translation} (${amount})`;
                })
              : props.veggies
                  .filter((veggie) => getCategoryForVeggie(veggie) === tooltip!.label)
                  .map(translateAndCapitalize)
                  .sort(collator.value.compare),
        },
      },
      datalabels: {
        formatter: (_, context) =>
          CATEGORY_EMOJI[context.chart.data.labels![context.dataIndex] as Category],
      },
    },
  })),
);

const chartTitle = computed(() =>
  props.favorites ? t('categoryStatus.veggiesTotal') : t('categoryStatus.veggiesOfTheWeek'),
);

defineExpose({chartData});
</script>
<template>
  <div ref="container" :class="{'shrink-0': !favorites}" class="category-status-chart__background">
    <Doughnut
      :data="chartData"
      :options="chartOptions"
      :aria-label="chartTitle"
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
      <span>{{ $t(topLabelKey) }}</span>
      <span :class="favorites ? 'text-5xl' : 'text-6xl'">{{ veggies.length }}</span>
      <span>{{ $t(bottomLabelKey, veggies.length) }}</span>
    </i18n-t>
    <ChartScreenReaderTable
      id="category-status-table"
      :title="chartTitle"
      :columnHeaders="chartData.labels.map((category) => t(`categories.${category}`))"
      :data="[chartData.datasets[0]!.data]"
    />
  </div>
</template>
<style scoped>
:deep(canvas) {
  @apply relative z-10;
}

.category-status-chart__background {
  @apply relative overflow-hidden max-h-[400px];
  @apply flex justify-center;
}

.category-status-chart__center-label {
  @apply flex flex-col items-center justify-center;
  @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 label-like;
}
</style>
