import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import {useAchievements} from '@/hooks/achievements';
import {AchievementLevel} from '@/utils/types';
import {take} from 'remeda';
import {ALL_VEGGIES, BEANS, FRUITS, GRAINS, LEAFIES, VEGETABLES} from '@/utils/constants';

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

const defaultAchievements = {
  completionist: AchievementLevel.NoAchievement,
  hotStreak: AchievementLevel.NoAchievement,
  experimenterFruit: AchievementLevel.NoAchievement,
  experimenterVegetable: AchievementLevel.NoAchievement,
  experimenterLeafy: AchievementLevel.NoAchievement,
  experimenterBean: AchievementLevel.NoAchievement,
  experimenterGrain: AchievementLevel.NoAchievement,
};

describe('achievements', () => {
  it('sets initial status', async () => {
    const {achievements} = await withSetup(useAchievements);
    expect(achievements.value).toEqual(defaultAchievements);
  });

  it('advances completionist', async () => {
    const {advance, achievements} = await withSetup(useAchievements);
    advance([...Array(39)], 0);
    expect(achievements.value.completionist).toEqual(AchievementLevel.NoAchievement);
    advance([...Array(40)], 0);
    expect(achievements.value.completionist).toBe(AchievementLevel.Bronze);
    advance([...Array(80)], 0);
    expect(achievements.value.completionist).toBe(AchievementLevel.Silver);
    advance([...Array(150)], 0);
    expect(achievements.value.completionist).toBe(AchievementLevel.Gold);
  });

  it('goes straight to silver', async () => {
    const {advance, achievements} = await withSetup(useAchievements);
    advance([...Array(80)], 0);
    expect(achievements.value.completionist).toBe(AchievementLevel.Silver);
  });

  it('goes straight to gold', async () => {
    const {advance, achievements} = await withSetup(useAchievements);
    advance([...Array(150)], 0);
    expect(achievements.value.completionist).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterFruit', async () => {
    const {advance, achievements} = await withSetup(useAchievements);
    advance(take(FRUITS, 14), 0);
    expect(achievements.value.experimenterFruit).toEqual(AchievementLevel.NoAchievement);
    advance(take(FRUITS, 15), 0);
    expect(achievements.value.experimenterFruit).toBe(AchievementLevel.Gold);
  });

  it('goes straight to gold', async () => {
    const {advance, achievements} = await withSetup(useAchievements);
    advance(take(FRUITS, 15), 0);
    expect(achievements.value.experimenterFruit).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterVegetable', async () => {
    const {advance, achievements} = await withSetup(useAchievements);
    advance(take(VEGETABLES, 14), 0);
    expect(achievements.value.experimenterVegetable).toEqual(AchievementLevel.NoAchievement);
    advance(take(VEGETABLES, 15), 0);
    expect(achievements.value.experimenterVegetable).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterLeafy', async () => {
    const {advance, achievements} = await withSetup(useAchievements);
    advance(take(LEAFIES, 14), 0);
    expect(achievements.value.experimenterLeafy).toEqual(AchievementLevel.NoAchievement);
    advance(take(LEAFIES, 15), 0);
    expect(achievements.value.experimenterLeafy).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterBean', async () => {
    const {advance, achievements} = await withSetup(useAchievements);
    advance(take(BEANS, 14), 0);
    expect(achievements.value.experimenterBean).toEqual(AchievementLevel.NoAchievement);
    advance(take(BEANS, 15), 0);
    expect(achievements.value.experimenterBean).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterGrain', async () => {
    const {advance, achievements} = await withSetup(useAchievements);
    advance(take(GRAINS, 14), 0);
    expect(achievements.value.experimenterGrain).toEqual(AchievementLevel.NoAchievement);
    advance(take(GRAINS, 15), 0);
    expect(achievements.value.experimenterGrain).toBe(AchievementLevel.Gold);
  });

  it('advances hot streak', async () => {
    const {advance, achievements} = await withSetup(useAchievements);
    advance([], 4);
    expect(achievements.value.hotStreak).toEqual(AchievementLevel.NoAchievement);
    advance([], 5);
    expect(achievements.value.hotStreak).toEqual(AchievementLevel.Bronze);
    advance([], 10);
    expect(achievements.value.hotStreak).toEqual(AchievementLevel.Silver);
    advance([], 20);
    expect(achievements.value.hotStreak).toEqual(AchievementLevel.Gold);
  });

  it('resets achievements', async () => {
    const {advance, achievements, reset} = await withSetup(useAchievements);
    advance(ALL_VEGGIES, 30);
    expect(achievements.value).toEqual({
      completionist: 3,
      experimenterBean: 3,
      experimenterFruit: 3,
      experimenterGrain: 3,
      experimenterLeafy: 3,
      experimenterVegetable: 3,
      hotStreak: 3,
    });
    reset();
    expect(achievements.value).toEqual(defaultAchievements);
  });
});
