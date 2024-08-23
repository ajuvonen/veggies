import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import AchievementList from '@/components/AchievementList.vue';
import {useActivityStore} from '@/stores/activityStore';
import {AchievementLevel} from '@/utils/types';

describe('AchievementList', () => {
  let activityStore: ReturnType<typeof useActivityStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
  });

  it('renders', () => {
    const wrapper = mount(AchievementList);
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.findAll('.badge[aria-disabled="true"]').length).toBe(11);
  });

  it('renders with badges enabled', () => {
    activityStore.achievements = {
      completionist: AchievementLevel.Gold,
      hotStreak: AchievementLevel.Gold,
      experimenterFruit: AchievementLevel.Gold,
      experimenterVegetable: AchievementLevel.Gold,
      experimenterLeafy: AchievementLevel.Gold,
      experimenterBean: AchievementLevel.Gold,
      experimenterGrain: AchievementLevel.Gold,
    };
    const wrapper = mount(AchievementList);
    expect(wrapper.findAll('.badge[aria-disabled="true"]').length).toBe(0);
  });
});
