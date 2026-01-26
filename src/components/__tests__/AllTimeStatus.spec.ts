import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import AllTimeStatus from '@/components/AllTimeStatus.vue';

const thisWeek = DateTime.now().startOf('week');
const lastWeek = thisWeek.minus({weeks: 1});
const twoWeeksAgo = thisWeek.minus({weeks: 2});

describe('AllTimeStatus', () => {
  let activityStore: ReturnType<typeof useActivityStore>;
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
    appStateStore = useAppStateStore();
  });

  it('renders', () => {
    const wrapper = mount(AllTimeStatus);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows total weeks', () => {
    appStateStore.settings.startDate = twoWeeksAgo;
    const wrapper = mount(AllTimeStatus);
    expect(wrapper.findByTestId('all-time-status-totalWeeks').text()).toBe('In Total 3 Weeks');
  });

  it('shows unique veggies', () => {
    appStateStore.settings.startDate = lastWeek;
    activityStore.weeks = [
      {
        startDate: lastWeek,
        veggies: ['apple', 'cucumber', 'potato'],
        challenge: 'cucumber',
      },
      {
        startDate: thisWeek,
        veggies: ['apple', 'cucumber', 'rice', 'fennel'],
        challenge: 'cucumber',
      },
    ];
    const wrapper = mount(AllTimeStatus);
    expect(wrapper.findByTestId('all-time-status-uniqueVeggies').text()).toBe(
      'In Total 5 Unique Veggies',
    );
  });

  it('shows weeks with over 30 veggies', () => {
    appStateStore.settings.startDate = twoWeeksAgo;
    activityStore.weeks = [
      {
        startDate: twoWeeksAgo,
        veggies: [...Array(31)],
        challenge: 'cucumber',
      },
      {
        startDate: lastWeek,
        veggies: [...Array(29)],
        challenge: 'cucumber',
      },
      {
        startDate: thisWeek,
        veggies: [...Array(30)],
        challenge: 'cucumber',
      },
    ];
    const wrapper = mount(AllTimeStatus);
    expect(wrapper.findByTestId('all-time-status-over30Veggies').text()).toBe(
      'Over 30 Veggies in 2 Weeks',
    );
  });

  it('shows highest number of veggies', () => {
    appStateStore.settings.startDate = twoWeeksAgo;
    activityStore.weeks = [
      {
        startDate: twoWeeksAgo,
        veggies: [...Array(31)],
        challenge: 'cucumber',
      },
      {
        startDate: lastWeek,
        veggies: [...Array(29)],
        challenge: 'cucumber',
      },
      {
        startDate: thisWeek,
        veggies: [...Array(30)],
        challenge: 'cucumber',
      },
    ];
    const wrapper = mount(AllTimeStatus);
    expect(wrapper.findByTestId('all-time-status-atMostVeggies').text()).toBe(
      'At Most 31 Weekly Veggies',
    );
  });
});
