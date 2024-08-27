import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import AchievementBadge from '@/components/AchievementBadge.vue';
import {AchievementLevel} from '@/utils/types';

describe('AchievementBadge', () => {
  it('renders active', () => {
    const wrapper = mount(AchievementBadge, {
      props: {
        achievement: 'completionist',
        level: AchievementLevel.Gold,
        active: true,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders inactive', () => {
    const wrapper = mount(AchievementBadge, {
      props: {
        achievement: 'hotStreak',
        level: AchievementLevel.Silver,
        active: false,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
