import {describe, it, expect, beforeEach} from 'vitest';
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
    const wrapper = mount(LogView);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders with data', () => {
    activityStore.settings.startDate = lastWeek;
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
    const wrapper = mount(LogView, {
      global: {
        stubs: {
          CategoryStatusChart: true,
        },
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
