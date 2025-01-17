import {describe, it, expect, beforeEach, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import LogView from '@/views/LogView.vue';
import {useActivityStore} from '@/stores/activityStore';

describe('LogView', () => {
  const thisWeek = DateTime.now().startOf('week');
  const lastWeek = thisWeek.minus({weeks: 1});
  let activityStore: ReturnType<typeof useActivityStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
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

  it('renders with data', () => {
    activityStore.startDate = lastWeek;
    activityStore.weeks.push(
      {
        veggies: ['wheat'],
        startDate: thisWeek,
      },
      {
        veggies: ['rye', 'rice', 'wheat'],
        startDate: lastWeek,
      },
    );
    const wrapper = mount(LogView);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders empty when week changes', async () => {
    activityStore.startDate = thisWeek;
    activityStore.weeks.push({
      veggies: ['rye', 'rice', 'wheat'],
      startDate: thisWeek,
    });
    const wrapper = mount(LogView);
    try {
      expect(wrapper.find('.front-page-animation').exists()).toBe(false);

      vi.setSystemTime(thisWeek.plus({days: 1}).toJSDate());
      await new Promise((resolve) => setTimeout(resolve, 1000));
      expect(wrapper.find('.front-page-animation').exists()).toBe(false);

      vi.setSystemTime(thisWeek.plus({weeks: 1}).toJSDate());
      await new Promise((resolve) => setTimeout(resolve, 1000));
      expect(wrapper.find('.front-page-animation').exists()).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });
});
