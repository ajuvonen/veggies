import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import AchievementBadge from '@/components/AchievementBadge.vue';
import {AchievementLevel} from '@/types';

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
    expect(wrapper.find('.badge').attributes('aria-label')).not.toContain('(');
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
    expect(wrapper.find('.badge').attributes('aria-label')).toContain('(locked)');
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

  it('renders partially active', async () => {
    const wrapper = mount(AchievementBadge, {
      props: {
        achievement: 'thirtyVeggies',
        level: AchievementLevel.Gold,
        active: false,
        degree: 180,
      },
    });

    const image = wrapper.find('.badge');
    expect(image.attributes('aria-label')).toContain('(50% done)');
    expect(wrapper.find('.badge__overlay').attributes('style')).toBe(
      'mask-image: conic-gradient(transparent 0deg 180deg, black 180deg 360deg);',
    );
    await wrapper.setProps({degree: 120});
    expect(image.attributes('aria-label')).toContain('(33% done)');
    expect(wrapper.find('.badge__overlay').attributes('style')).toBe(
      'mask-image: conic-gradient(transparent 0deg 120deg, black 120deg 360deg);',
    );
  });
});
