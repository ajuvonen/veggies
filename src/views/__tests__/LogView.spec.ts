import {computed} from 'vue';
import {describe, it, expect, beforeEach, vi, afterEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import LogView from '@/views/LogView.vue';

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

const mounter = (options = {}) => {
  return mount(LogView, {
    global: {
      stubs: {
        Dialog: true,
      },
    },
    ...options,
  });
};

describe('LogView', () => {
  const thisWeek = DateTime.now().startOf('week');
  const lastWeek = thisWeek.minus({weeks: 1});
  let activityStore: ReturnType<typeof useActivityStore>;
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
    appStateStore = useAppStateStore();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders', () => {
    const wrapper = mounter({
      global: {
        stubs: {
          FrontPageAnimation: true,
          Dialog: true,
        },
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders with animation', async () => {
    const wrapper = mounter();
    await vi.dynamicImportSettled();
    expect(wrapper.findByTestId('front-page-animation').exists()).toBe(true);
  });

  it('renders without animation when reduced motion is preferred', async () => {
    mocks.usePreferredReducedMotion.mockReturnValue(computed(() => 'reduce'));
    const wrapper = mounter();
    await vi.dynamicImportSettled();
    expect(wrapper.findByTestId('front-page-animation').exists()).toBe(false);
  });

  it('renders with data', async () => {
    appStateStore.settings.startDate = lastWeek;
    activityStore.weeks = [
      {
        veggies: ['rye', 'rice', 'wheat'],
        startDate: lastWeek,
        challenge: 'radish',
      },
      {
        veggies: ['wheat'],
        startDate: thisWeek,
        challenge: 'morel',
      },
    ];
    const wrapper = mounter();
    await vi.dynamicImportSettled();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders empty when week changes', async () => {
    appStateStore.settings.startDate = thisWeek;
    activityStore.weeks = [
      {
        veggies: ['rye', 'rice', 'wheat'],
        startDate: thisWeek,
        challenge: 'cucumber',
      },
    ];
    const wrapper = mounter();
    try {
      expect(wrapper.findByTestId('front-page-animation').exists()).toBe(false);

      vi.setSystemTime(thisWeek.plus({days: 1}).toJSDate());
      await new Promise((resolve) => setTimeout(resolve, 2000));
      expect(wrapper.findByTestId('front-page-animation').exists()).toBe(false);

      vi.setSystemTime(thisWeek.plus({weeks: 1}).toJSDate());
      await new Promise((resolve) => setTimeout(resolve, 2000));
      expect(wrapper.findByTestId('front-page-animation').exists()).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  }, 6000);
});
