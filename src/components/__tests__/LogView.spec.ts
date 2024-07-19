import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import LogView from '@/views/LogView.vue';
import {useActivityStore} from '@/stores/activityStore';

describe('LogView', () => {
  let activityStore: ReturnType<typeof useActivityStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
  });

  it('renders', () => {
    const wrapper = mount(LogView);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders with data', () => {
    const now = DateTime.now();
    activityStore.settings.startDate = now.startOf('week').minus({weeks: 1});
    activityStore.activities.push(
      {
        veggie: 'wheat',
        date: now,
      },
      {
        veggie: 'rye',
        date: now.minus({weeks: 1}),
      },
      {
        veggie: 'rice',
        date: now.minus({weeks: 1}),
      },
      {
        veggie: 'wheat',
        date: now.minus({weeks: 1}),
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
