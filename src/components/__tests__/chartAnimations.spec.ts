import {computed} from 'vue';
import {vi, describe, it, expect, afterEach, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {useChartAnimations} from '@/hooks/chartAnimations';
import {useAppStateStore} from '@/stores/appStateStore';

const mocks = vi.hoisted(() => ({
  usePreferredReducedMotion: vi.fn(() => computed(() => 'no-preference')),
}));

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual('@vueuse/core');
  return {
    ...actual,
    usePreferredReducedMotion: mocks.usePreferredReducedMotion,
  };
});

const withSetup = () =>
  new Promise<ReturnType<typeof useChartAnimations>>((resolve) => {
    mount({
      shallow: true,
      template: '<div />',
      setup() {
        resolve(useChartAnimations());
      },
    });
  });

describe('chartAnimations', () => {
  let appStateStore: ReturnType<typeof useAppStateStore>;
  beforeEach(() => {
    appStateStore = useAppStateStore();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns chart animations from store', async () => {
    const {showChartAnimations} = await withSetup();
    expect(showChartAnimations.value).toBe(true);
    appStateStore.settings.showChartAnimations = false;
    expect(showChartAnimations.value).toBe(false);
  });

  it('reduced motion overrides store', async () => {
    mocks.usePreferredReducedMotion.mockReturnValue(computed(() => 'reduce'));
    const {showChartAnimations} = await withSetup();
    expect(showChartAnimations.value).toBe(false);
    appStateStore.settings.showChartAnimations = false;
    expect(showChartAnimations.value).toBe(false);
  });

  it('returns false reduced motion value', () => {
    const {reduceMotion} = useChartAnimations();
    expect(reduceMotion.value).toBe(false);
  });

  it('returns true reduced motion value', () => {
    mocks.usePreferredReducedMotion.mockReturnValue(computed(() => 'reduce'));
    const {reduceMotion} = useChartAnimations();
    expect(reduceMotion.value).toBe(true);
  });
});
