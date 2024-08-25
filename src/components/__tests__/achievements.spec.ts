import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import {useAchievements} from '@/hooks/achievements';
import {AchievementLevel, type Achievements} from '@/utils/types';
import {take} from 'remeda';
import {ALL_VEGGIES, BEANS, FRUITS, GRAINS, LEAFIES, ROOTS, VEGETABLES} from '@/utils/constants';

const withSetup = <T>(hook: () => T) =>
  new Promise<T>((resolve) => {
    mount({
      shallow: true,
      template: '<div></div>',
      setup() {
        resolve(hook());
      },
    });
  });

const defaultAchievements: Achievements = {
  completionist: AchievementLevel.NoAchievement,
  hotStreak: AchievementLevel.NoAchievement,
  experimenterBean: AchievementLevel.NoAchievement,
  experimenterFruit: AchievementLevel.NoAchievement,
  experimenterGrain: AchievementLevel.NoAchievement,
  experimenterLeafy: AchievementLevel.NoAchievement,
  experimenterRoot: AchievementLevel.NoAchievement,
  experimenterVegetable: AchievementLevel.NoAchievement,
};

describe('achievements', () => {
  it('sets initial status', async () => {
    const {achievements} = await withSetup(useAchievements);
    expect(achievements.value).toEqual(defaultAchievements);
  });

  it('advances completionist', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements([...Array(39)], 0);
    expect(achievements.value.completionist).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements([...Array(40)], 0);
    expect(achievements.value.completionist).toBe(AchievementLevel.Bronze);
    advanceAchievements([...Array(80)], 0);
    expect(achievements.value.completionist).toBe(AchievementLevel.Silver);
    advanceAchievements([...Array(150)], 0);
    expect(achievements.value.completionist).toBe(AchievementLevel.Gold);
  });

  it('goes straight to silver', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements([...Array(80)], 0);
    expect(achievements.value.completionist).toBe(AchievementLevel.Silver);
  });

  it('goes straight to gold', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements([...Array(150)], 0);
    expect(achievements.value.completionist).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterFruit', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(take(FRUITS, 14), 0);
    expect(achievements.value.experimenterFruit).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(take(FRUITS, 15), 0);
    expect(achievements.value.experimenterFruit).toBe(AchievementLevel.Gold);
  });

  it('goes straight to gold', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(take(FRUITS, 15), 0);
    expect(achievements.value.experimenterFruit).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterVegetable', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(take(VEGETABLES, 14), 0);
    expect(achievements.value.experimenterVegetable).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(take(VEGETABLES, 15), 0);
    expect(achievements.value.experimenterVegetable).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterLeafy', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(take(LEAFIES, 14), 0);
    expect(achievements.value.experimenterLeafy).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(take(LEAFIES, 15), 0);
    expect(achievements.value.experimenterLeafy).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterBean', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(take(BEANS, 14), 0);
    expect(achievements.value.experimenterBean).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(take(BEANS, 15), 0);
    expect(achievements.value.experimenterBean).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterRoot', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(take(ROOTS, 14), 0);
    expect(achievements.value.experimenterRoot).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(take(ROOTS, 15), 0);
    expect(achievements.value.experimenterRoot).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterGrain', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(take(GRAINS, 14), 0);
    expect(achievements.value.experimenterGrain).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(take(GRAINS, 15), 0);
    expect(achievements.value.experimenterGrain).toBe(AchievementLevel.Gold);
  });

  it('advances hot streak', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements([], 4);
    expect(achievements.value.hotStreak).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements([], 5);
    expect(achievements.value.hotStreak).toEqual(AchievementLevel.Bronze);
    advanceAchievements([], 10);
    expect(achievements.value.hotStreak).toEqual(AchievementLevel.Silver);
    advanceAchievements([], 20);
    expect(achievements.value.hotStreak).toEqual(AchievementLevel.Gold);
  });

  it('resets achievements', async () => {
    const {advanceAchievements, achievements, resetAchievements} = await withSetup(useAchievements);
    advanceAchievements(ALL_VEGGIES, 30);
    expect(achievements.value).toEqual({
      completionist: 3,
      experimenterBean: 3,
      experimenterRoot: 3,
      experimenterFruit: 3,
      experimenterGrain: 3,
      experimenterLeafy: 3,
      experimenterVegetable: 3,
      hotStreak: 3,
    });
    resetAchievements();
    expect(achievements.value).toEqual(defaultAchievements);
  });
});
