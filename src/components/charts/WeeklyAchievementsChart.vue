<script lang="ts" setup>
import {computed, useTemplateRef} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {groupByProp} from 'remeda';
import {Chart as ChartJS, type ScaleOptions, type ScriptableContext} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type {MatrixDataPoint} from 'chartjs-chart-matrix';
import {useChartContainer} from '@/hooks/chartContainer';
import {useChartOptions} from '@/hooks/chartOptions';
import {useAvailableWeeklyAchievements} from '@/hooks/availableWeeklyAchievements';
import {useActivityStore} from '@/stores/activityStore';
import {type WeeklyChartData, AchievementLevel} from '@/types';
import {CHART_COLORS, WEEKLY_ACHIEVEMENT_EMOJI} from '@/utils/constants';

ChartJS.register(ChartDataLabels);

const props = defineProps<{
  weekData: WeeklyChartData;
}>();

const {availableWeeklyAchievements} = useAvailableWeeklyAchievements();
const {weeklyAchievements, veggiesForWeek} = storeToRefs(useActivityStore());
const {t} = useI18n();

const chartContainer = useTemplateRef('chartContainer');
const {xAlign, yAlign} = useChartContainer(chartContainer);

const chartData = computed(() => {
  const data: MatrixDataPoint[] = props.weekData.weekStarts.flatMap((weekStart, weekIndex) => {
    const achievements = weeklyAchievements.value(veggiesForWeek.value(weekStart), weekStart);
    return availableWeeklyAchievements.value.map((achievement) => ({
      x: props.weekData.labels[weekIndex],
      y: WEEKLY_ACHIEVEMENT_EMOJI[achievement],
      v: achievements[achievement] >= AchievementLevel.Gold ? 1 : 0,
      rawData: achievement,
      weekIndex,
    }));
  });

  return {
    datasets: [
      {
        data,
        backgroundColor: ({raw}: ScriptableContext<'matrix'>) => {
          const value = (raw as MatrixDataPoint).v ?? 0;
          const opacityDecimal = Math.round(128 + value * 127);
          const opacityHex = opacityDecimal.toString(16).toUpperCase().padStart(2, '0');
          return CHART_COLORS[4] + opacityHex;
        },
        width: ({chart}: ScriptableContext<'matrix'>) =>
          chart.chartArea.width / props.weekData.weekStarts.length - 1,
        height: ({chart}: ScriptableContext<'matrix'>) =>
          chart.chartArea.height / availableWeeklyAchievements.value.length - 1,
      },
    ],
    accessibleData: {
      rowHeaders: availableWeeklyAchievements.value.map((achievement) => {
        const translationProps = achievement === 'thirtyVeggies' ? [30] : [];
        return t(`achievements.${achievement}.badgeText`, translationProps);
      }),
      data: Object.values(groupByProp(data, 'rawData')).map((items) =>
        items.map(({v}) => (v === 1 ? t('stats.earned') : t('stats.notEarned'))),
      ),
    },
  };
});

const yScale: ScaleOptions = {
  type: 'category',
  offset: true,
  ticks: {
    font: {
      size: 25,
    },
  },
  grid: {
    display: false,
  },
};

const {chartOptions} = useChartOptions<'matrix'>(
  true,
  false,
  false,
  computed(() => ({
    normalized: false,
    scales: {
      x: {
        type: 'category',
        labels: props.weekData.labels,
        grid: {
          display: false,
        },
      },
      y: yScale,
      y1: yScale,
    },
    plugins: {
      tooltip: {
        xAlign,
        yAlign,
        filter: ({dataset, dataIndex}) => {
          const {v} = dataset.data[dataIndex] as MatrixDataPoint;
          return v === 1;
        },
        callbacks: {
          title: ([tooltip]) => {
            if (!tooltip) return undefined;
            const {weekIndex} = tooltip.raw as MatrixDataPoint;
            return props.weekData.weekStrings[weekIndex];
          },
          label: ({raw}) => {
            const {rawData} = raw as MatrixDataPoint;
            const translationProps = rawData === 'thirtyVeggies' ? [30] : [];
            return `${t(`achievements.${rawData}.badgeText`, translationProps)}: ${t('stats.earned').toLowerCase()}`;
          },
        },
      },
      datalabels: {
        display: ({dataset, dataIndex}) => {
          const {v} = dataset.data[dataIndex] as MatrixDataPoint;
          return v === 1;
        },
        formatter: () => '🏅',
        font: {
          size: 25,
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
      <HeatmapChart
        id="weekly-achievements-chart"
        :options="chartOptions"
        :data="chartData"
        :aria-label="$t('stats.weeklyAchievements')"
        :aria-description="$t('general.seeTableBelow')"
        data-test-id="weekly-achievements-chart"
      />
    </div>
    <MatrixScreenReaderTable
      :title="$t('stats.weeklyAchievements')"
      :columnHeaders="weekData.labels"
      :rowHeaders="chartData.accessibleData.rowHeaders"
      :data="chartData.accessibleData.data"
      data-test-id="weekly-achievements-table"
    />
  </div>
</template>
