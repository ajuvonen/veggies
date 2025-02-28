import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import AchievementList from '@/components/AchievementList.vue';

describe('AchievementList', () => {
  it('renders', () => {
    const wrapper = mount(AchievementList, {
      props: {
        achievements: {
          challengeAccepted: 0,
          committed: 0,
          completionist: 0,
          experimenterBean: 0,
          experimenterFruit: 0,
          experimenterGrain: 0,
          experimenterLeafy: 0,
          experimenterRoot: 0,
          experimenterVegetable: 0,
          favorite: 0,
          hotStreak: 0,
          thirtyVeggies: 0,
        },
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.findAll('.badge[aria-disabled="true"]').length).toBe(22);
  });

  it('renders with badges enabled', async () => {
    const wrapper = mount(AchievementList, {
      props: {
        achievements: {
          challengeAccepted: 0,
          committed: 0,
          completionist: 2,
          experimenterBean: 3,
          experimenterFruit: 3,
          experimenterGrain: 3,
          experimenterLeafy: 3,
          experimenterRoot: 3,
          experimenterVegetable: 3,
          favorite: 0,
          hotStreak: 0,
          thirtyVeggies: 4,
        },
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.findAll('.badge[aria-disabled="true"]').length).toBe(13);
  });
});
