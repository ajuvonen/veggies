import {computed} from 'vue';
import {describe, it, expect, beforeEach, vi, afterEach} from 'vitest';
import {enableAutoUnmount, mount, flushPromises} from '@vue/test-utils';
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
  enableAutoUnmount(afterEach);
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders', () => {
    const wrapper = mounter({
      global: {
        stubs: {
          FrontPageAnimation: true,
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
    mocks.usePreferredReducedMotion.mockReturnValueOnce(computed(() => 'reduce'));
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

  it('shows first veggie toast when the very first veggie is added', async () => {
    mounter();
    activityStore.weeks = [{startDate: thisWeek, veggies: ['apple'], challenge: 'broccoli'}];
    await flushPromises();
    expect(appStateStore.addToastMessage).toHaveBeenCalledWith(
      expect.stringContaining('First veggie added!'),
    );
  });

  it('shows new challenge toast when the first veggie of the week is added', async () => {
    appStateStore.settings.startDate = lastWeek;
    activityStore.weeks = [
      {startDate: lastWeek, veggies: ['carrot', 'apple'], challenge: 'radish'},
      {startDate: thisWeek, veggies: [], challenge: 'broccoli'},
    ];
    mounter();
    activityStore.weeks = [
      {startDate: lastWeek, veggies: ['carrot', 'apple'], challenge: 'radish'},
      {startDate: thisWeek, veggies: ['banana'], challenge: 'broccoli'},
    ];
    await flushPromises();
    expect(appStateStore.addToastMessage).toHaveBeenCalledWith(
      expect.stringContaining("Let's go!"),
    );
  });

  it('shows challenge completed toast when the challenge veggie is added', async () => {
    activityStore.weeks = [{startDate: thisWeek, veggies: ['carrot'], challenge: 'broccoli'}];
    mounter();
    activityStore.weeks = [
      {startDate: thisWeek, veggies: ['carrot', 'broccoli'], challenge: 'broccoli'},
    ];
    await flushPromises();
    expect(appStateStore.addToastMessage).toHaveBeenCalledWith(
      expect.stringContaining('You have completed your weekly challenge!'),
    );
  });

  it('shows a facts toast when a veggie is added and veggie facts are enabled', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // forces the random gate open
    activityStore.weeks = [{startDate: thisWeek, veggies: ['carrot'], challenge: 'broccoli'}];
    mounter();
    activityStore.weeks = [
      {startDate: thisWeek, veggies: ['carrot', 'banana'], challenge: 'broccoli'},
    ];
    await vi.dynamicImportSettled();

    expect(appStateStore.addToastMessage).toHaveBeenCalledOnce();
  });

  it('shows no toast when a veggie is added and veggie facts are disabled', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // forces the random gate open
    appStateStore.settings.showVeggieFacts = false;
    activityStore.weeks = [{startDate: thisWeek, veggies: ['carrot'], challenge: 'broccoli'}];
    mounter();
    activityStore.weeks = [
      {startDate: thisWeek, veggies: ['carrot', 'banana'], challenge: 'broccoli'},
    ];
    await flushPromises();

    expect(appStateStore.addToastMessage).not.toHaveBeenCalled();
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
    await vi.dynamicImportSettled();
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
