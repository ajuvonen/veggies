import {describe, it, expect, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import {useAchievements} from '@/hooks/achievements';
import {AchievementLevel, type Achievements} from '@/utils/types';
import {take} from 'remeda';
import {BEANS, FRUITS, GRAINS, LEAFIES, VEGETABLES} from '@/utils/constants';

const withSetup = <T>(hook: (achievements: Achievements) => T, achievements: Achievements) =>
  new Promise<T>((resolve) => {
    mount({
      shallow: true,
      template: '<div></div>',
      setup() {
        resolve(hook(achievements));
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
    const {achievementStatus} = await withSetup(useAchievements, defaultAchievements);
    expect(achievementStatus.value).toEqual(defaultAchievements);
  });

  it('advances completionist', async () => {
    const {advance, achievementStatus} = await withSetup(useAchievements, defaultAchievements);
    advance([...Array(39)], 0);
    expect(achievementStatus.value.completionist).toEqual(AchievementLevel.NoAchievement);
    advance([...Array(40)], 0);
    expect(achievementStatus.value.completionist).toBe(AchievementLevel.Bronze);
    advance([...Array(80)], 0);
    expect(achievementStatus.value.completionist).toBe(AchievementLevel.Silver);
    advance([...Array(150)], 0);
    expect(achievementStatus.value.completionist).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterFruit', async () => {
    const {advance, achievementStatus} = await withSetup(useAchievements, defaultAchievements);
    advance(take(FRUITS, 14), 0);
    expect(achievementStatus.value.experimenterFruit).toEqual(AchievementLevel.NoAchievement);
    advance(take(FRUITS, 15), 0);
    expect(achievementStatus.value.experimenterFruit).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterVegetable', async () => {
    const {advance, achievementStatus} = await withSetup(useAchievements, defaultAchievements);
    advance(take(VEGETABLES, 14), 0);
    expect(achievementStatus.value.experimenterVegetable).toEqual(AchievementLevel.NoAchievement);
    advance(take(VEGETABLES, 15), 0);
    expect(achievementStatus.value.experimenterVegetable).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterLeafy', async () => {
    const {advance, achievementStatus} = await withSetup(useAchievements, defaultAchievements);
    advance(take(LEAFIES, 14), 0);
    expect(achievementStatus.value.experimenterLeafy).toEqual(AchievementLevel.NoAchievement);
    advance(take(LEAFIES, 15), 0);
    expect(achievementStatus.value.experimenterLeafy).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterBean', async () => {
    const {advance, achievementStatus} = await withSetup(useAchievements, defaultAchievements);
    advance(take(BEANS, 14), 0);
    expect(achievementStatus.value.experimenterBean).toEqual(AchievementLevel.NoAchievement);
    advance(take(BEANS, 15), 0);
    expect(achievementStatus.value.experimenterBean).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterGrain', async () => {
    const {advance, achievementStatus} = await withSetup(useAchievements, defaultAchievements);
    advance(take(GRAINS, 14), 0);
    expect(achievementStatus.value.experimenterGrain).toEqual(AchievementLevel.NoAchievement);
    advance(take(GRAINS, 15), 0);
    expect(achievementStatus.value.experimenterGrain).toBe(AchievementLevel.Gold);
  });

  it('advances hot streak', async () => {
    const {advance, achievementStatus} = await withSetup(useAchievements, defaultAchievements);
    advance([], 4);
    expect(achievementStatus.value.hotStreak).toEqual(AchievementLevel.NoAchievement);
    advance([], 5);
    expect(achievementStatus.value.hotStreak).toEqual(AchievementLevel.Bronze);
    advance([], 10);
    expect(achievementStatus.value.hotStreak).toEqual(AchievementLevel.Silver);
    advance([], 20);
    expect(achievementStatus.value.hotStreak).toEqual(AchievementLevel.Gold);
  });
});
