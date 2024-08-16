import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import AchievementList from '@/components/AchievementList.vue';
import {useActivityStore} from '@/stores/activityStore';

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
    activityStore.achievements = [
      'completionistBronze',
      'completionistSilver',
      'completionistGold',
      'experimenterFruit',
      'experimenterVegetable',
      'experimenterLeafy',
      'experimenterBean',
      'experimenterGrain',
      'hotStreakBronze',
      'hotStreakSilver',
      'hotStreakGold',
    ];
    const wrapper = mount(AchievementList);
    expect(wrapper.findAll('.badge[aria-disabled="true"]').length).toBe(0);
  });
});
