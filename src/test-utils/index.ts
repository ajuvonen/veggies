import {mount} from '@vue/test-utils';
import {AchievementLevel, type Achievements} from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withSetup = <T, Args extends any[]>(
  composable: (...args: Args) => T,
  ...args: Args
): T => {
  let result: T;
  mount({
    setup() {
      result = composable(...args);
      return () => {};
    },
  });
  return result!;
};

export const getAchievements = (achievements: Partial<Achievements> = {}): Achievements => ({
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
  thousandsEven: AchievementLevel.NoAchievement,
  thousandsOdd: AchievementLevel.NoAchievement,
  ...achievements,
});
