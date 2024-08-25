import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {take} from 'remeda';
import {DateTime} from 'luxon';
import {useActivityStore} from '@/stores/activityStore';
import {BEANS, FRUITS, GRAINS, LEAFIES, ROOTS, VEGETABLES} from '@/utils/constants';
import AchievementList from '@/components/AchievementList.vue';

describe('AchievementList', () => {
  let activityStore: ReturnType<typeof useActivityStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
  });

  it('renders', () => {
    const wrapper = mount(AchievementList);
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.findAll('.badge[aria-disabled="true"]').length).toBe(12);
  });

  it('renders with badges enabled', () => {
    const thisWeek = DateTime.now().startOf('week');
    activityStore.startDate = thisWeek;
    activityStore.weeks.push({
      startDate: thisWeek,
      veggies: [
        ...take(FRUITS, 15),
        ...take(VEGETABLES, 15),
        ...take(LEAFIES, 15),
        ...take(BEANS, 15),
        ...take(ROOTS, 15),
        ...take(GRAINS, 15),
      ],
    });

    const wrapper = mount(AchievementList);
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.findAll('.badge[aria-disabled="true"]').length).toBe(4);
  });
});
