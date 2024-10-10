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
  challengeAccepted: AchievementLevel.NoAchievement,
  committed: AchievementLevel.NoAchievement,
  completionist: AchievementLevel.NoAchievement,
  hotStreak: AchievementLevel.NoAchievement,
  experimenterBean: AchievementLevel.NoAchievement,
  experimenterFruit: AchievementLevel.NoAchievement,
  experimenterGrain: AchievementLevel.NoAchievement,
  experimenterLeafy: AchievementLevel.NoAchievement,
  experimenterRoot: AchievementLevel.NoAchievement,
  experimenterVegetable: AchievementLevel.NoAchievement,
  thirtyVeggies: AchievementLevel.NoAchievement,
};

describe('achievements', () => {
  it('sets initial status', async () => {
    const {achievements} = await withSetup(useAchievements);
    expect(achievements.value).toEqual(defaultAchievements);
  });

  it('advances completionist', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(0, [...Array(39)], 0, 0, 0);
    expect(achievements.value.completionist).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(0, [...Array(40)], 0, 0, 0);
    expect(achievements.value.completionist).toBe(AchievementLevel.Bronze);
    advanceAchievements(0, [...Array(80)], 0, 0, 0);
    expect(achievements.value.completionist).toBe(AchievementLevel.Silver);
    advanceAchievements(0, [...Array(150)], 0, 0, 0);
    expect(achievements.value.completionist).toBe(AchievementLevel.Gold);
  });

  it('goes straight to silver', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(0, [...Array(80)], 0, 0, 0);
    expect(achievements.value.completionist).toBe(AchievementLevel.Silver);
  });

  it('goes straight to gold', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(0, [...Array(150)], 0, 0, 0);
    expect(achievements.value.completionist).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterFruit', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(0, take(FRUITS, 14), 0, 0, 0);
    expect(achievements.value.experimenterFruit).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(0, take(FRUITS, 15), 0, 0, 0);
    expect(achievements.value.experimenterFruit).toBe(AchievementLevel.Gold);
  });

  it('goes straight to gold', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(0, take(FRUITS, 15), 0, 0, 0);
    expect(achievements.value.experimenterFruit).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterVegetable', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(0, take(VEGETABLES, 14), 0, 0, 0);
    expect(achievements.value.experimenterVegetable).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(0, take(VEGETABLES, 15), 0, 0, 0);
    expect(achievements.value.experimenterVegetable).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterLeafy', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(0, take(LEAFIES, 14), 0, 0, 0);
    expect(achievements.value.experimenterLeafy).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(0, take(LEAFIES, 15), 0, 0, 0);
    expect(achievements.value.experimenterLeafy).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterBean', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(0, take(BEANS, 14), 0, 0, 0);
    expect(achievements.value.experimenterBean).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(0, take(BEANS, 15), 0, 0, 0);
    expect(achievements.value.experimenterBean).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterRoot', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(0, take(ROOTS, 14), 0, 0, 0);
    expect(achievements.value.experimenterRoot).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(0, take(ROOTS, 15), 0, 0, 0);
    expect(achievements.value.experimenterRoot).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterGrain', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(0, take(GRAINS, 14), 0, 0, 0);
    expect(achievements.value.experimenterGrain).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(0, take(GRAINS, 15), 0, 0, 0);
    expect(achievements.value.experimenterGrain).toBe(AchievementLevel.Gold);
  });

  it('advances hot streak', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(0, [], 4, 0, 0);
    expect(achievements.value.hotStreak).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(0, [], 5, 0, 0);
    expect(achievements.value.hotStreak).toEqual(AchievementLevel.Bronze);
    advanceAchievements(0, [], 10, 0, 0);
    expect(achievements.value.hotStreak).toEqual(AchievementLevel.Silver);
    advanceAchievements(0, [], 20, 0, 0);
    expect(achievements.value.hotStreak).toEqual(AchievementLevel.Gold);
  });

  it('advances committed', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(0, [], 0, 11, 0);
    expect(achievements.value.committed).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(0, [], 0, 12, 0);
    expect(achievements.value.committed).toEqual(AchievementLevel.Bronze);
    advanceAchievements(0, [], 0, 26, 0);
    expect(achievements.value.committed).toEqual(AchievementLevel.Silver);
    advanceAchievements(0, [], 0, 52, 0);
    expect(achievements.value.committed).toEqual(AchievementLevel.Gold);
  });

  it('advances challengeAccepted', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(0, [], 0, 0, 4);
    expect(achievements.value.challengeAccepted).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(0, [], 0, 0, 5);
    expect(achievements.value.challengeAccepted).toEqual(AchievementLevel.Bronze);
    advanceAchievements(0, [], 0, 0, 10);
    expect(achievements.value.challengeAccepted).toEqual(AchievementLevel.Silver);
    advanceAchievements(0, [], 0, 0, 20);
    expect(achievements.value.challengeAccepted).toEqual(AchievementLevel.Gold);
  });

  it('advances thirtyVeggies', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(29, [], 0, 0, 0);
    expect(achievements.value.thirtyVeggies).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(30, [], 0, 0, 0);
    expect(achievements.value.thirtyVeggies).toBe(AchievementLevel.Gold);
  });

  it('resets thirtyVeggies after a week', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(30, [], 0, 0, 0);
    expect(achievements.value.thirtyVeggies).toEqual(AchievementLevel.Gold);
    advanceAchievements(0, [], 0, 0, 0);
    expect(achievements.value.thirtyVeggies).toBe(AchievementLevel.NoAchievement);
  });

  it('resets achievements', async () => {
    const expectedAchievements: Achievements = {
      challengeAccepted: AchievementLevel.Gold,
      committed: AchievementLevel.Gold,
      completionist: AchievementLevel.Gold,
      experimenterBean: AchievementLevel.Gold,
      experimenterRoot: AchievementLevel.Gold,
      experimenterFruit: AchievementLevel.Gold,
      experimenterGrain: AchievementLevel.Gold,
      experimenterLeafy: AchievementLevel.Gold,
      experimenterVegetable: AchievementLevel.Gold,
      hotStreak: AchievementLevel.Gold,
      thirtyVeggies: AchievementLevel.Gold,
    };
    const {advanceAchievements, achievements, resetAchievements} = await withSetup(useAchievements);
    advanceAchievements(30, ALL_VEGGIES, 30, 52, 20);
    expect(achievements.value).toEqual(expectedAchievements);
    resetAchievements();
    expect(achievements.value).toEqual(defaultAchievements);
  });
});
