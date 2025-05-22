import {computed} from 'vue';
import {describe, it, expect, beforeEach, vi, afterEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import LogView from '@/views/LogView.vue';
import {useActivityStore} from '@/stores/activityStore';

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

describe('LogView', () => {
  const thisWeek = DateTime.now().startOf('week');
  const lastWeek = thisWeek.minus({weeks: 1});
  let activityStore: ReturnType<typeof useActivityStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders', () => {
    const wrapper = mount(LogView, {
      global: {
        stubs: {
          FrontPageAnimation: true,
        },
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders with animation', () => {
    const wrapper = mount(LogView);
    expect(wrapper).toBeTruthy();
  });

  it('renders without animation when reduced motion is preferred', () => {
    mocks.usePreferredReducedMotion.mockReturnValue(computed(() => 'reduce'));
    const wrapper = mount(LogView);
    expect(wrapper.find('.front-page-animation').exists()).toBe(false);
  });

  it('renders with data', () => {
    activityStore.startDate = lastWeek;
    activityStore.weeks = [
      {
        veggies: ['rye', 'rice', 'wheat'],
        startDate: lastWeek,
      },
      {
        veggies: ['wheat'],
        startDate: thisWeek,
      },
    ];
    activityStore.challenges = [
      {
        startDate: lastWeek,
        veggie: 'radish',
      },
      {
        startDate: thisWeek,
        veggie: 'morel',
      },
    ];
    const wrapper = mount(LogView);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders empty when week changes', async () => {
    activityStore.startDate = thisWeek;
    activityStore.weeks = [
      {
        veggies: ['rye', 'rice', 'wheat'],
        startDate: thisWeek,
      },
    ];
    const wrapper = mount(LogView);
    try {
      expect(wrapper.find('.front-page-animation').exists()).toBe(false);

      vi.setSystemTime(thisWeek.plus({days: 1}).toJSDate());
      await new Promise((resolve) => setTimeout(resolve, 2000));
      expect(wrapper.find('.front-page-animation').exists()).toBe(false);

      vi.setSystemTime(thisWeek.plus({weeks: 1}).toJSDate());
      await new Promise((resolve) => setTimeout(resolve, 2000));
      expect(wrapper.find('.front-page-animation').exists()).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  }, 5500);
});
