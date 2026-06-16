<script lang="ts" setup>
import {computed, useTemplateRef} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {useChartContainer} from '@/hooks/chartContainer';
import {useChartOptions} from '@/hooks/chartOptions';
import {useActivityStore} from '@/stores/activityStore';
import {type WeeklyChartData, AchievementLevel, type WeeklyAchievements} from '@/types';
import {COLORS} from '@/utils/constants';

ChartJS.defaults.font.family = 'Nunito';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, ChartDataLabels);

const props = defineProps<{
  weekData: WeeklyChartData;
}>();

const {weeklyAchievements, veggiesForWeek} = storeToRefs(useActivityStore());
const {t} = useI18n();

const chartContainer = useTemplateRef('chartContainer');
const {xAlign, yAlign} = useChartContainer(chartContainer);

const chartData = computed(() => {
  const data = props.weekData.weekStarts.map((weekStart, index) => {
    const achievements = weeklyAchievements.value(veggiesForWeek.value(weekStart), weekStart);
    const items = (Object.entries(achievements) as [keyof WeeklyAchievements, AchievementLevel][])
      .filter(([, level]) => level >= AchievementLevel.Gold)
      .map(([key, level]) => {
        const translationParams = [];
        if (key === 'thirtyVeggies') {
          const veggieCount = level === AchievementLevel.Platinum ? 40 : 30;
          translationParams.push(veggieCount);
        }
        return t(`achievements.${key}.badgeText`, translationParams);
      });

    return {
      x: props.weekData.labels[index],
      y: items.length,
      items,
    };
  });

  return {
    datasets: [
      {
        data,
        borderColor: COLORS.chartColorsAlternate[2],
        backgroundColor: COLORS.chartColorsAlternate[2],
      },
    ],
    accessibleData: {
      data: data.map(({items}) => items.join(', ') || t('stats.noWeeklyAchievements')),
    },
  };
});

const {chartOptions} = useChartOptions<'line'>(true, false, false, {
  scales: {
    y: {
      min: 0,
      max: 8,
    },
  },
  plugins: {
    tooltip: {
      yAlign,
      xAlign,
      callbacks: {
        title: ([{dataIndex}]) => props.weekData.weekStrings[dataIndex],
        label: ({raw}) => {
          const {items} = raw as {x: string; y: number; items: string[]};
          if (items.length === 0) {
            return t('stats.noWeeklyAchievements');
          }
          return items;
        },
      },
    },
    datalabels: {
      display: true,
      font: {
        size: 25,
      },
      formatter: ({items}) => {
        if (items.length >= 1) {
          return '🏅';
        }
        return '';
      },
    },
  },
  elements: {
    point: {
      hitRadius: 15,
    },
  },
});

defineExpose({chartData});
</script>
<template>
  <div ref="chartContainer" class="has-scroll has-scroll--flush">
    <div
      :style="{width: `max(100%, ${weekData.weekStarts.length * 60}px)`}"
      class="relative h-full"
    >
      <Line
        id="weekly-achievements-chart"
        :options="chartOptions"
        :data="chartData as any"
        :aria-label="$t('stats.weeklyAchievements')"
        :aria-description="$t('general.seeTableBelow')"
        data-test-id="weekly-achievements-chart"
      />
    </div>
    <SimpleScreenReaderTable
      :title="$t('stats.weeklyAchievements')"
      :columnHeaders="weekData.labels"
      :data="chartData.accessibleData.data"
      data-test-id="weekly-achievements-table"
    />
  </div>
</template>
