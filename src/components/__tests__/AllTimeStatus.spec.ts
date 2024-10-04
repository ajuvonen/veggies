import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import {useActivityStore} from '@/stores/activityStore';
import AllTimeStatus from '@/components/AllTimeStatus.vue';

describe('AllTimeStatus', () => {
  let activityStore: ReturnType<typeof useActivityStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
  });

  it('renders', () => {
    const wrapper = mount(AllTimeStatus);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows total weeks', () => {
    activityStore.startDate = DateTime.now().startOf('week').minus({weeks: 2});
    const wrapper = mount(AllTimeStatus);
    expect(wrapper.findByTestId('all-time-weeks').text()).toBe('In Total 3 Weeks');
  });

  it('shows unique veggies', () => {
    activityStore.startDate = DateTime.now().startOf('week').minus({weeks: 1});
    activityStore.weeks.push(
      {
        startDate: DateTime.now().startOf('week').minus({weeks: 1}),
        veggies: ['apple', 'cucumber', 'potato'],
      },
      {
        startDate: DateTime.now().startOf('week'),
        veggies: ['apple', 'cucumber', 'rice', 'fennel'],
      },
    );
    const wrapper = mount(AllTimeStatus);
    expect(wrapper.findByTestId('all-time-unique').text()).toBe('In Total 5 Unique Veggies');
  });

  it('shows weeks with over 30 veggies', () => {
    activityStore.startDate = DateTime.now().startOf('week').minus({weeks: 2});
    activityStore.weeks.push(
      {
        startDate: DateTime.now().startOf('week').minus({weeks: 2}),
        veggies: [...Array(31)],
      },
      {
        startDate: DateTime.now().startOf('week').minus({weeks: 1}),
        veggies: [...Array(29)],
      },
      {
        startDate: DateTime.now().startOf('week'),
        veggies: [...Array(30)],
      },
    );
    const wrapper = mount(AllTimeStatus);
    expect(wrapper.findByTestId('all-time-over-30').text()).toBe('Over 30 Veggies in 2 Weeks');
  });

  it('shows highest number of veggies', () => {
    activityStore.startDate = DateTime.now().startOf('week').minus({weeks: 2});
    activityStore.weeks.push(
      {
        startDate: DateTime.now().startOf('week').minus({weeks: 2}),
        veggies: [...Array(31)],
      },
      {
        startDate: DateTime.now().startOf('week').minus({weeks: 1}),
        veggies: [...Array(29)],
      },
      {
        startDate: DateTime.now().startOf('week'),
        veggies: [...Array(30)],
      },
    );
    const wrapper = mount(AllTimeStatus);
    expect(wrapper.findByTestId('all-time-at-most').text()).toBe('At Most 31 Veggies in a Week');
  });
});
