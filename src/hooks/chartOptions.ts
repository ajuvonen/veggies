import {computed, toValue, type MaybeRefOrGetter} from 'vue';
import {mergeDeep} from 'remeda';
import type {ChartOptions, ChartType, Scale} from 'chart.js';
import {useChartAnimations} from '@/hooks/chartAnimations';
import {CATEGORY_EMOJI} from '@/utils/constants';
import type {Context} from 'chartjs-plugin-datalabels';
import type {Category} from '@/types';

export function useChartOptions<T extends ChartType>(
  showGrid: boolean,
  stacked: boolean,
  showCategoryEmoji: boolean,
  overrides: MaybeRefOrGetter<Partial<ChartOptions<T>>>,
) {
  const {showChartAnimations} = useChartAnimations();
  const chartOptions = computed(() => {
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text');
    return mergeDeep(
      {
        animation: !showChartAnimations.value ? false : undefined,
        responsive: true,
        maintainAspectRatio: !showGrid,
        normalized: true,
        layout: {
          padding: 0,
        },
        scales: showGrid
          ? {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0,
                  color: textColor,
                },
                stacked,
              },
              y1: {
                position: 'right',
                beginAtZero: true,
                ticks: {
                  precision: 0,
                  color: textColor,
                },
                stacked,
                afterBuildTicks: (axis: Scale) => {
                  axis.ticks = [...axis.chart.scales.y!.ticks];
                  axis.min = axis.chart.scales.y!.min;
                  axis.max = axis.chart.scales.y!.max;
                },
              },
              x: {
                beginAtZero: true,
                ticks: {
                  precision: 0,
                  color: textColor,
                },
                stacked,
              },
            }
          : undefined,
        plugins: {
          title: {
            display: false,
          },
          legend: {
            display: false,
          },
          datalabels: {
            ...(showCategoryEmoji
              ? {
                  anchor: 'center',
                  align: 'center',
                  font: {
                    size: 25,
                  },
                  textShadowColor: '#fff',
                  textShadowBlur: 5,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter: (value: any, {dataset: {label}}: Context) =>
                    value ? CATEGORY_EMOJI[label as Category] : '',
                }
              : {
                  display: false,
                }),
          },
          tooltip: {
            animation: showChartAnimations.value,
            padding: 8,
            titleFont: {
              size: 14,
              weight: 'normal',
            },
            bodyFont: {
              size: 14,
            },
            footerFont: {
              size: 14,
              weight: 'normal',
            },
            displayColors: false,
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue(
              '--color-ui-dark',
            ),
            bodyColor: textColor,
            titleColor: textColor,
          },
        },
      },
      toValue(overrides),
    ) as ChartOptions<T>;
  });

  return {
    chartOptions,
  };
}
