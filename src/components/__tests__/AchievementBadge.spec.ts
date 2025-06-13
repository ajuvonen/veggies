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

  it('does not render gradient when achievement is active', () => {
    const wrapper = mount(AchievementBadge, {
      props: {
        achievement: 'goNuts',
        level: AchievementLevel.Gold,
        active: true,
        degree: 360,
      },
    });
    expect(wrapper.find('.badge__overlay').exists()).toBe(false);
  });

  it('renders gradient', async () => {
    const wrapper = mount(AchievementBadge, {
      props: {
        achievement: 'thirtyVeggies',
        level: AchievementLevel.Gold,
        active: false,
        degree: 180,
      },
    });

    expect(wrapper.find('.badge__overlay').attributes('style')).toBe(
      'mask-image: conic-gradient(transparent 0deg 180deg, black 180deg 360deg);',
    );
    await wrapper.setProps({degree: 120});
    expect(wrapper.find('.badge__overlay').attributes('style')).toBe(
      'mask-image: conic-gradient(transparent 0deg 120deg, black 120deg 360deg);',
    );
  });
});
