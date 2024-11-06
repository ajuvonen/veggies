import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import {useActivityStore} from '@/stores/activityStore';
import PopularityStatistics from '@/components/PopularityStatistics.vue';
import {Category} from '@/utils/types';

const thisWeek = DateTime.now().startOf('week');
const lastWeek = DateTime.now().startOf('week').minus({weeks: 1});
const twoWeeksAgo = DateTime.now().startOf('week').minus({weeks: 2});

describe('PopularityStatistics', () => {
  let activityStore: ReturnType<typeof useActivityStore>;
  beforeEach(() => {
    activityStore = useActivityStore();
  });

  it('renders empty', () => {
    const wrapper = mount(PopularityStatistics);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders with data', () => {
    activityStore.startDate = thisWeek;
    activityStore.weeks.push({
      startDate: thisWeek,
      veggies: ['apple', 'cucumber', 'romaine', 'potato', 'red bean', 'teff'],
    });

    const wrapper = mount(PopularityStatistics);
    expect(wrapper.findByTestId('popularity-Fruit-1').find('.popularity__entry-text').text()).toBe(
      'apple (1)',
    );
    expect(
      wrapper.findByTestId('popularity-Vegetable-1').find('.popularity__entry-text').text(),
    ).toBe('cucumber (1)');
    expect(wrapper.findByTestId('popularity-Leafy-1').find('.popularity__entry-text').text()).toBe(
      'romaine (1)',
    );
    expect(wrapper.findByTestId('popularity-Root-1').find('.popularity__entry-text').text()).toBe(
      'potato (1)',
    );
    expect(wrapper.findByTestId('popularity-Bean-1').find('.popularity__entry-text').text()).toBe(
      'red bean (1)',
    );
    expect(wrapper.findByTestId('popularity-Grain-1').find('.popularity__entry-text').text()).toBe(
      'teff (1)',
    );

    Object.values(Category).forEach((category) => {
      expect(
        wrapper.findByTestId(`popularity-${category}-2`).find('.popularity__entry-text').text(),
      ).toBe('No Entry');
      expect(
        wrapper.findByTestId(`popularity-${category}-3`).find('.popularity__entry-text').text(),
      ).toBe('No Entry');
    });
  });

  it('renders entries in correct order', () => {
    activityStore.startDate = twoWeeksAgo;
    activityStore.weeks.push(
      {
        startDate: twoWeeksAgo,
        veggies: ['apple', 'lychee', 'pineapple'],
      },
      {
        startDate: lastWeek,
        veggies: ['apple', 'lychee', 'longan'],
      },
      {
        startDate: thisWeek,
        veggies: ['apple', 'blueberry', 'cloudberry'],
      },
    );

    const wrapper = mount(PopularityStatistics);
    expect(wrapper.findByTestId('popularity-Fruit-1').find('.popularity__entry-text').text()).toBe(
      'apple (3)',
    );
    expect(wrapper.findByTestId('popularity-Fruit-2').find('.popularity__entry-text').text()).toBe(
      'lychee (2)',
    );
    expect(wrapper.findByTestId('popularity-Fruit-3').find('.popularity__entry-text').text()).toBe(
      'pineapple (1)',
    );
  });
});
