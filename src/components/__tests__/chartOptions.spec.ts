import {ref} from 'vue';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import type {ChartOptions, ChartType} from 'chart.js';
import {useChartOptions} from '@/hooks/chartOptions';

const mockedPreferredReducedMotion = ref('no-preference');

const mocks = vi.hoisted(() => ({
  usePreferredReducedMotion: vi.fn(() => mockedPreferredReducedMotion),
}));

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual('@vueuse/core');
  return {
    ...actual,
    usePreferredReducedMotion: mocks.usePreferredReducedMotion,
  };
});

const withSetup = <T extends ChartType>(
  showGrid: boolean,
  stacked: boolean,
  showCategoryEmoji: boolean,
  overrides: Partial<ChartOptions<T>> = {},
) =>
  new Promise<ReturnType<typeof useChartOptions<T>>>((resolve) => {
    mount({
      shallow: true,
      template: '<div />',
      setup() {
        resolve(useChartOptions<T>(showGrid, stacked, showCategoryEmoji, overrides));
      },
    });
  });

describe('chartOptions', () => {
  beforeEach(() => {
    mockedPreferredReducedMotion.value = 'no-preference';
  });

  it('disables animations', async () => {
    const {chartOptions} = await withSetup<'bar'>(true, true, true);

    expect(chartOptions.value.animation).toBe(undefined);
    expect(chartOptions.value.plugins?.tooltip?.animation).toBe(true);
    mockedPreferredReducedMotion.value = 'reduce';
    expect(chartOptions.value.animation).toBe(false);
    expect(chartOptions.value.plugins?.tooltip?.animation).toBe(false);
  });

  it('shows scales when showGrid is true', async () => {
    const {chartOptions} = await withSetup<'bar'>(true, false, false);

    expect(chartOptions.value.scales).toBeDefined();
    expect(chartOptions.value.scales?.x).toBeDefined();
    expect(chartOptions.value.scales?.y).toBeDefined();
    expect(chartOptions.value.scales?.y1).toBeDefined();
    expect(chartOptions.value.maintainAspectRatio).toBe(false);
  });

  it('hides scales when showGrid is false', async () => {
    const {chartOptions} = await withSetup<'doughnut'>(false, false, false);

    expect(chartOptions.value.scales).toBeUndefined();
    expect(chartOptions.value.maintainAspectRatio).toBe(true);
  });

  it('enables stacking when stacked is true', async () => {
    const {chartOptions} = await withSetup<'bar'>(true, true, false);

    expect(chartOptions.value.scales?.x?.stacked).toBe(true);
    expect(chartOptions.value.scales?.y?.stacked).toBe(true);
    expect(chartOptions.value.scales?.y1?.stacked).toBe(true);
  });

  it('disables stacking when stacked is false', async () => {
    const {chartOptions} = await withSetup<'bar'>(true, false, false);

    expect(chartOptions.value.scales?.x?.stacked).toBe(false);
    expect(chartOptions.value.scales?.y?.stacked).toBe(false);
    expect(chartOptions.value.scales?.y1?.stacked).toBe(false);
  });

  it('shows datalabels when showCategoryEmoji is true', async () => {
    const {chartOptions} = await withSetup<'doughnut'>(false, false, true);
    expect(chartOptions.value.plugins?.datalabels?.display).toBeUndefined();
    expect(chartOptions.value.plugins?.datalabels?.formatter).toBeDefined();
  });

  it('hides datalabels when showCategoryEmoji is false', async () => {
    const {chartOptions} = await withSetup<'bar'>(true, false, false);
    expect(chartOptions.value.plugins?.datalabels?.display).toBe(false);
    expect(chartOptions.value.plugins?.datalabels?.anchor).toBeUndefined();
    expect(chartOptions.value.plugins?.datalabels?.align).toBeUndefined();
  });

  it('handles showGrid=false, stacked=true, showCategoryEmoji=true', async () => {
    const {chartOptions} = await withSetup<'doughnut'>(false, true, true);
    expect(chartOptions.value.scales).toBeUndefined();
    expect(chartOptions.value.maintainAspectRatio).toBe(true);
    expect(chartOptions.value.plugins?.datalabels?.display).toBeUndefined();
    expect(chartOptions.value.plugins?.datalabels?.anchor).toBe('center');
  });

  it('handles showGrid=true, stacked=false, showCategoryEmoji=false', async () => {
    const {chartOptions} = await withSetup<'bar'>(true, false, false);
    expect(chartOptions.value.scales).toBeDefined();
    expect(chartOptions.value.scales?.x?.stacked).toBe(false);
    expect(chartOptions.value.scales?.y?.stacked).toBe(false);
    expect(chartOptions.value.maintainAspectRatio).toBe(false);
    expect(chartOptions.value.plugins?.datalabels?.display).toBe(false);
  });

  it('sets correct default values', async () => {
    const {chartOptions} = await withSetup<'bar'>(true, false, false);
    expect(chartOptions.value.responsive).toBe(true);
    expect(chartOptions.value.normalized).toBe(true);
    expect(chartOptions.value.layout?.padding).toBe(0);
    expect(chartOptions.value.plugins?.title?.display).toBe(false);
    expect(chartOptions.value.plugins?.legend?.display).toBe(false);
    expect(chartOptions.value.plugins?.tooltip?.padding).toBe(8);
    expect(chartOptions.value.plugins?.tooltip?.displayColors).toBe(false);
  });

  it('merges overrides deeply', async () => {
    const overrides = {
      responsive: false,
      scales: {
        x: {
          beginAtZero: false,
          ticks: {
            precision: 2,
          },
        },
      },
      plugins: {
        tooltip: {
          padding: 16,
          displayColors: true,
        },
        legend: {
          display: true,
          position: 'top' as const,
        },
      },
    };

    const {chartOptions} = await withSetup<'bar'>(true, false, false, overrides);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scales = chartOptions.value.scales as any;

    // Overridden values
    expect(chartOptions.value.responsive).toBe(false);
    expect(scales?.x?.beginAtZero).toBe(false);
    expect(scales?.x?.ticks?.precision).toBe(2);
    expect(chartOptions.value.plugins?.tooltip?.padding).toBe(16);
    expect(chartOptions.value.plugins?.tooltip?.displayColors).toBe(true);
    expect(chartOptions.value.plugins?.legend?.display).toBe(true);
    expect(chartOptions.value.plugins?.legend?.position).toBe('top');

    // Non-overridden values should remain
    expect(chartOptions.value.normalized).toBe(true);
    expect(scales?.y?.beginAtZero).toBe(true);
    expect(scales?.x?.stacked).toBe(false);
  });
});
