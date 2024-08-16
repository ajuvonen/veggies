import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import AchievementBadge from '@/components/AchievementBadge.vue';

describe('AchievementBadge', () => {
  it('renders active', () => {
    const wrapper = mount(AchievementBadge, {
      props: {
        text: 'Great Success',
        color: 'gold',
        emoji: '🥇',
        active: true,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders inactive', () => {
    const wrapper = mount(AchievementBadge, {
      props: {
        text: 'Second place',
        color: 'silver',
        emoji: '🥈',
        active: false,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
