import {computed} from 'vue';
import {describe, it, expect, beforeEach} from 'vitest';
import {flushPromises, mount} from '@vue/test-utils';
import {useActivityStore} from '@/stores/activityStore';
import {AchievementLevel, type Achievements} from '@/utils/types';
import DialogStub from './DialogStub.vue';
import AchievementDialog from '@/components/AchievementDialog.vue';

const getAchievements = (achievements: Partial<Achievements> = {}) =>
  computed(() => ({
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
    thirtyVeggies: AchievementLevel.NoAchievement,
    thousandsOdd: AchievementLevel.NoAchievement,
    thousandsEven: AchievementLevel.NoAchievement,
    ...achievements,
  }));

const mounter = () =>
  mount(AchievementDialog, {
    global: {
      stubs: {
        Dialog: DialogStub,
        DialogPanel: {
          template: '<div><slot /></div>',
        },
        DialogTitle: true,
      },
    },
  });

describe('AchievementDialog', () => {
  let activityStore: ReturnType<typeof useActivityStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
  });

  it('shows dialog when achievements change', async () => {
    const wrapper = mounter();

    expect(wrapper.find('#achievement-dialog').exists()).toBe(false);

    // @ts-expect-error
    activityStore.achievements = getAchievements({
      allOnRed: AchievementLevel.Gold,
    });

    await flushPromises();
    expect(wrapper.find('#achievement-dialog').exists()).toBe(true);
  });

  it('does not show dialog if levels go down', async () => {
    // @ts-expect-error
    activityStore.achievements = getAchievements({
      allOnRed: AchievementLevel.Gold,
      thirtyVeggies: AchievementLevel.Platinum,
    });

    const wrapper = mounter();

    expect(wrapper.find('#achievement-dialog').exists()).toBe(false);

    // @ts-expect-error
    activityStore.achievements = getAchievements({
      allOnRed: AchievementLevel.NoAchievement,
      thirtyVeggies: AchievementLevel.Gold,
    });

    await flushPromises();
    expect(wrapper.find('#achievement-dialog').exists()).toBe(false);
  });

  it('renders all new achievements', async () => {
    // @ts-expect-error
    activityStore.achievements = getAchievements({
      allOnRed: AchievementLevel.Gold,
      thirtyVeggies: AchievementLevel.Gold,
    });

    const wrapper = mounter();

    expect(wrapper.find('#achievement-dialog').exists()).toBe(false);

    // @ts-expect-error
    activityStore.achievements = getAchievements({
      allOnRed: AchievementLevel.NoAchievement,
      experimenterBean: AchievementLevel.Gold,
      goNuts: AchievementLevel.Gold,
      thirtyVeggies: AchievementLevel.Platinum,
    });

    await flushPromises();
    expect(wrapper.find('#achievement-dialog').exists()).toBe(true);
    expect(wrapper.find('.badge--experimenterBean').exists()).toBe(true);
    expect(wrapper.find('.badge--goNuts').exists()).toBe(true);
    expect(wrapper.find('.badge--thirtyVeggies').exists()).toBe(true);
    console.log(wrapper.html());
  });
});
