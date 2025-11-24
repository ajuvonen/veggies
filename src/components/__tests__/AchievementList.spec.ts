import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import {AchievementLevel, type Achievements} from '@/utils/types';
import AchievementList from '@/components/AchievementList.vue';

const getAchievements = (achievements: Partial<Achievements> = {}) => ({
  allOnRed: AchievementLevel.NoAchievement,
  botanicalBerries: AchievementLevel.NoAchievement,
  challengeAccepted: AchievementLevel.NoAchievement,
  committed: AchievementLevel.NoAchievement,
  completionist: AchievementLevel.NoAchievement,
  experimenterBean: AchievementLevel.NoAchievement,
  experimenterFruit: AchievementLevel.NoAchievement,
  experimenterGrain: AchievementLevel.NoAchievement,
  experimenterLeafy: AchievementLevel.NoAchievement,
  experimenterMushroom: AchievementLevel.NoAchievement,
  experimenterRoot: AchievementLevel.NoAchievement,
  experimenterVegetable: AchievementLevel.NoAchievement,
  goNuts: AchievementLevel.NoAchievement,
  hotStreak: AchievementLevel.NoAchievement,
  lemons: AchievementLevel.NoAchievement,
  overachiever: AchievementLevel.NoAchievement,
  rainbow: AchievementLevel.NoAchievement,
  tearnado: AchievementLevel.NoAchievement,
  thirtyVeggies: AchievementLevel.NoAchievement,
  thousandsOdd: AchievementLevel.NoAchievement,
  thousandsEven: AchievementLevel.NoAchievement,
  ...achievements,
});

describe('AchievementList', () => {
  it('renders', () => {
    const wrapper = mount(AchievementList, {
      props: {
        achievements: getAchievements(),
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.findAll('.badge--locked').length).toBe(27);
  });

  it('renders with some badges enabled', async () => {
    const wrapper = mount(AchievementList, {
      props: {
        achievements: getAchievements({
          allOnRed: AchievementLevel.Gold,
          botanicalBerries: AchievementLevel.Gold,
          completionist: AchievementLevel.Silver,
          experimenterBean: AchievementLevel.Gold,
          experimenterFruit: AchievementLevel.Gold,
          experimenterGrain: AchievementLevel.Gold,
          experimenterLeafy: AchievementLevel.Gold,
          experimenterMushroom: AchievementLevel.Gold,
          experimenterRoot: AchievementLevel.Gold,
          experimenterVegetable: AchievementLevel.Gold,
          goNuts: AchievementLevel.Gold,
          lemons: AchievementLevel.Gold,
          thirtyVeggies: AchievementLevel.Platinum,
          thousandsOdd: AchievementLevel.Platinum,
        }),
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.findAll('.badge--locked').length).toBe(13);
  });

  it('renders the thousands achievement correctly', async () => {
    const wrapper = mount(AchievementList, {
      props: {
        achievements: getAchievements(),
      },
    });

    expect(wrapper.findByTestId('thousands-container').exists()).toBe(false);
    await wrapper.setProps({
      achievements: getAchievements({thousandsOdd: AchievementLevel.Platinum}),
    });
    expect(wrapper.findByTestId('thousands-container').exists()).toBe(true);
    expect(wrapper.findByTestId('thousands-odd-achievement').exists()).toBe(true);
    expect(wrapper.findByTestId('thousands-even-achievement').exists()).toBe(false);
    await wrapper.setProps({
      achievements: getAchievements({thousandsEven: AchievementLevel.Platinum}),
    });
    expect(wrapper.findByTestId('thousands-container').exists()).toBe(true);
    expect(wrapper.findByTestId('thousands-odd-achievement').exists()).toBe(false);
    expect(wrapper.findByTestId('thousands-even-achievement').exists()).toBe(true);
  });
});
