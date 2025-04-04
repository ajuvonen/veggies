import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import {useAchievements} from '@/hooks/achievements';
import {
  AchievementLevel,
  Category,
  type AchievementProps,
  type Achievements,
  type Favorites,
} from '@/utils/types';
import {take} from 'remeda';
import {
  ALL_VEGGIES,
  BEANS,
  FRUITS,
  GRAINS,
  LEAFIES,
  MUSHROOMS,
  ROOTS,
  VEGETABLES,
} from '@/utils/constants';

const withSetup = <T>(hook: () => T) =>
  new Promise<T>((resolve) => {
    mount({
      shallow: true,
      template: '<div />',
      setup() {
        resolve(hook());
      },
    });
  });

const defaultAchievements: Achievements = {
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
  favorite: AchievementLevel.NoAchievement,
  hotStreak: AchievementLevel.NoAchievement,
  thirtyVeggies: AchievementLevel.NoAchievement,
  thousandsOdd: AchievementLevel.NoAchievement,
  thousandsEven: AchievementLevel.NoAchievement,
};

const getFavorites = (amount: number = 0) =>
  Object.values(Category).reduce(
    (acc, category) => ({
      ...acc,
      [category]: amount ? [['veggie', amount]] : [],
    }),
    {} as Favorites,
  );

const getProps = (achievementProps: Partial<AchievementProps> = {}): AchievementProps => ({
  completedChallenges: 0,
  favorites: getFavorites(),
  hotStreakLength: 0,
  totalVeggies: 0,
  totalWeeks: 0,
  uniqueVeggies: [],
  veggiesThisWeek: 0,
  ...achievementProps,
});

describe('achievements', () => {
  it('sets initial status', async () => {
    const {achievements} = await withSetup(useAchievements);
    expect(achievements.value).toEqual(defaultAchievements);
  });

  it('advances completionist', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(getProps({uniqueVeggies: [...Array(39)]}));
    expect(achievements.value.completionist).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(getProps({uniqueVeggies: [...Array(40)]}));
    expect(achievements.value.completionist).toBe(AchievementLevel.Bronze);
    advanceAchievements(getProps({uniqueVeggies: [...Array(80)]}));
    expect(achievements.value.completionist).toBe(AchievementLevel.Silver);
    advanceAchievements(getProps({uniqueVeggies: [...Array(150)]}));
    expect(achievements.value.completionist).toBe(AchievementLevel.Gold);
  });

  it('goes straight to silver', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(getProps({uniqueVeggies: [...Array(80)]}));
    expect(achievements.value.completionist).toBe(AchievementLevel.Silver);
  });

  it('completionist goes straight to gold', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(getProps({uniqueVeggies: [...Array(150)]}));
    expect(achievements.value.completionist).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterFruit', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(getProps({uniqueVeggies: take(FRUITS, 14)}));
    expect(achievements.value.experimenterFruit).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(getProps({uniqueVeggies: take(FRUITS, 15)}));
    expect(achievements.value.experimenterFruit).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterVegetable', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(getProps({uniqueVeggies: take(VEGETABLES, 14)}));
    expect(achievements.value.experimenterVegetable).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(getProps({uniqueVeggies: take(VEGETABLES, 15)}));
    expect(achievements.value.experimenterVegetable).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterLeafy', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(getProps({uniqueVeggies: take(LEAFIES, 14)}));
    expect(achievements.value.experimenterLeafy).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(getProps({uniqueVeggies: take(LEAFIES, 15)}));
    expect(achievements.value.experimenterLeafy).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterMushroom', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(getProps({uniqueVeggies: take(MUSHROOMS, 9)}));
    expect(achievements.value.experimenterMushroom).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(getProps({uniqueVeggies: take(MUSHROOMS, 10)}));
    expect(achievements.value.experimenterMushroom).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterBean', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(getProps({uniqueVeggies: take(BEANS, 14)}));
    expect(achievements.value.experimenterBean).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(getProps({uniqueVeggies: take(BEANS, 15)}));
    expect(achievements.value.experimenterBean).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterRoot', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(getProps({uniqueVeggies: take(ROOTS, 14)}));
    expect(achievements.value.experimenterRoot).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(getProps({uniqueVeggies: take(ROOTS, 15)}));
    expect(achievements.value.experimenterRoot).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterGrain', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(getProps({uniqueVeggies: take(GRAINS, 14)}));
    expect(achievements.value.experimenterGrain).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(getProps({uniqueVeggies: take(GRAINS, 15)}));
    expect(achievements.value.experimenterGrain).toBe(AchievementLevel.Gold);
  });

  it('advances hot streak', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(getProps({hotStreakLength: 4}));
    expect(achievements.value.hotStreak).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(getProps({hotStreakLength: 5}));
    expect(achievements.value.hotStreak).toEqual(AchievementLevel.Bronze);
    advanceAchievements(getProps({hotStreakLength: 10}));
    expect(achievements.value.hotStreak).toEqual(AchievementLevel.Silver);
    advanceAchievements(getProps({hotStreakLength: 20}));
    expect(achievements.value.hotStreak).toEqual(AchievementLevel.Gold);
  });

  it('resets hot streak', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(getProps({hotStreakLength: 5}));
    expect(achievements.value.hotStreak).toEqual(AchievementLevel.Bronze);
    advanceAchievements(getProps({hotStreakLength: 0}));
    expect(achievements.value.hotStreak).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(getProps({hotStreakLength: 10}));
    expect(achievements.value.hotStreak).toEqual(AchievementLevel.Silver);
    advanceAchievements(getProps({hotStreakLength: 0}));
    expect(achievements.value.hotStreak).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(getProps({hotStreakLength: 20}));
    expect(achievements.value.hotStreak).toEqual(AchievementLevel.Gold);
    advanceAchievements(getProps({hotStreakLength: 0}));
    expect(achievements.value.hotStreak).toEqual(AchievementLevel.NoAchievement);
  });

  it('advances committed', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(getProps({totalWeeks: 11}));
    expect(achievements.value.committed).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(getProps({totalWeeks: 12}));
    expect(achievements.value.committed).toEqual(AchievementLevel.Bronze);
    advanceAchievements(getProps({totalWeeks: 26}));
    expect(achievements.value.committed).toEqual(AchievementLevel.Silver);
    advanceAchievements(getProps({totalWeeks: 52}));
    expect(achievements.value.committed).toEqual(AchievementLevel.Gold);
  });

  it('advances challengeAccepted', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(getProps({completedChallenges: 4}));
    expect(achievements.value.challengeAccepted).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(getProps({completedChallenges: 5}));
    expect(achievements.value.challengeAccepted).toEqual(AchievementLevel.Bronze);
    advanceAchievements(getProps({completedChallenges: 10}));
    expect(achievements.value.challengeAccepted).toEqual(AchievementLevel.Silver);
    advanceAchievements(getProps({completedChallenges: 20}));
    expect(achievements.value.challengeAccepted).toEqual(AchievementLevel.Gold);
  });

  it('advances thirtyVeggies', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(getProps({veggiesThisWeek: 29}));
    expect(achievements.value.thirtyVeggies).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(getProps({veggiesThisWeek: 30}));
    expect(achievements.value.thirtyVeggies).toBe(AchievementLevel.Gold);
    advanceAchievements(getProps({veggiesThisWeek: 40}));
    expect(achievements.value.thirtyVeggies).toBe(AchievementLevel.Platinum);
  });

  it('resets thirtyVeggies', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(getProps({veggiesThisWeek: 30}));
    expect(achievements.value.thirtyVeggies).toEqual(AchievementLevel.Gold);
    advanceAchievements(getProps({veggiesThisWeek: 0}));
    expect(achievements.value.thirtyVeggies).toBe(AchievementLevel.NoAchievement);
    advanceAchievements(getProps({veggiesThisWeek: 40}));
    expect(achievements.value.thirtyVeggies).toEqual(AchievementLevel.Platinum);
    advanceAchievements(getProps({veggiesThisWeek: 0}));
    expect(achievements.value.thirtyVeggies).toBe(AchievementLevel.NoAchievement);
    advanceAchievements(getProps({veggiesThisWeek: 40}));
    expect(achievements.value.thirtyVeggies).toEqual(AchievementLevel.Platinum);
    advanceAchievements(getProps({veggiesThisWeek: 39}));
    expect(achievements.value.thirtyVeggies).toBe(AchievementLevel.Gold);
  });

  it('advances favorite', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(getProps({favorites: getFavorites(4)}));
    expect(achievements.value.favorite).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(getProps({favorites: getFavorites(5)}));
    expect(achievements.value.favorite).toEqual(AchievementLevel.Bronze);
    advanceAchievements(getProps({favorites: getFavorites(15)}));
    expect(achievements.value.favorite).toEqual(AchievementLevel.Silver);
    advanceAchievements(getProps({favorites: getFavorites(30)}));
    expect(achievements.value.favorite).toEqual(AchievementLevel.Gold);
  });

  it('advances thousands', async () => {
    const {advanceAchievements, achievements} = await withSetup(useAchievements);
    advanceAchievements(getProps({totalVeggies: 999}));
    expect(achievements.value.thousandsOdd).toEqual(AchievementLevel.NoAchievement);
    expect(achievements.value.thousandsEven).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(getProps({totalVeggies: 1000}));
    expect(achievements.value.thousandsOdd).toEqual(AchievementLevel.Platinum);
    expect(achievements.value.thousandsEven).toEqual(AchievementLevel.NoAchievement);
    advanceAchievements(getProps({totalVeggies: 2000}));
    expect(achievements.value.thousandsOdd).toEqual(AchievementLevel.NoAchievement);
    expect(achievements.value.thousandsEven).toEqual(AchievementLevel.Platinum);
    advanceAchievements(getProps({totalVeggies: 2001}));
    expect(achievements.value.thousandsOdd).toEqual(AchievementLevel.NoAchievement);
    expect(achievements.value.thousandsEven).toEqual(AchievementLevel.Platinum);
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
      experimenterMushroom: AchievementLevel.Gold,
      experimenterVegetable: AchievementLevel.Gold,
      favorite: AchievementLevel.Gold,
      hotStreak: AchievementLevel.Gold,
      thirtyVeggies: AchievementLevel.Platinum,
      thousandsOdd: AchievementLevel.Platinum,
      thousandsEven: AchievementLevel.NoAchievement,
    };
    const {advanceAchievements, achievements, resetAchievements} = await withSetup(useAchievements);
    advanceAchievements({
      completedChallenges: 20,
      favorites: getFavorites(50),
      hotStreakLength: 30,
      totalVeggies: 1000,
      totalWeeks: 52,
      uniqueVeggies: ALL_VEGGIES,
      veggiesThisWeek: 40,
    });
    expect(achievements.value).toEqual(expectedAchievements);
    resetAchievements();
    expect(achievements.value).toEqual(defaultAchievements);
  });
});
