import {describe, it, expect, beforeEach} from 'vitest';
import {take} from 'remeda';
import {AchievementLevel, type Achievements, type Week} from '@/types';
import {
  ALL_VEGGIES,
  BEANS,
  BOTANICAL_BERRIES,
  CITRUSES,
  FRUITS,
  GRAINS,
  LEAFIES,
  MUSHROOMS,
  NUTS,
  ONIONS,
  RED_VEGGIES,
  ROOTS,
  VEGETABLES,
} from '@/utils/veggieDetails';
import {useActivityStore} from '@/stores/activityStore';
import {DateTime} from 'luxon';

const createWeeks = (amount: number, veggies: string[] = []): Week[] =>
  [...Array(amount)]
    .map((_, index) => ({
      startDate: DateTime.now().startOf('week').minus({weeks: index}),
      veggies,
      challenge: 'cucumber',
    }))
    .reverse();

describe('achievements', () => {
  let activityStore: ReturnType<typeof useActivityStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
  });

  it('sets initial status', async () => {
    const defaultAchievements: Achievements = {
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
    };
    expect(activityStore.achievements).toEqual(defaultAchievements);
  });

  it('advances completionist', async () => {
    activityStore.weeks = createWeeks(1, take(ALL_VEGGIES, 39));
    expect(activityStore.achievements.completionist).toEqual(AchievementLevel.NoAchievement);
    activityStore.weeks = createWeeks(1, take(ALL_VEGGIES, 40));
    expect(activityStore.achievements.completionist).toBe(AchievementLevel.Bronze);
    activityStore.weeks = createWeeks(1, take(ALL_VEGGIES, 80));
    expect(activityStore.achievements.completionist).toBe(AchievementLevel.Silver);
    activityStore.weeks = createWeeks(1, take(ALL_VEGGIES, 150));
    expect(activityStore.achievements.completionist).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterFruit', async () => {
    activityStore.weeks = createWeeks(1, take(FRUITS, 14));
    expect(activityStore.achievements.experimenterFruit).toEqual(AchievementLevel.NoAchievement);
    activityStore.weeks = createWeeks(1, take(FRUITS, 15));
    expect(activityStore.achievements.experimenterFruit).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterVegetable', async () => {
    activityStore.weeks = createWeeks(1, take(VEGETABLES, 14));
    expect(activityStore.achievements.experimenterVegetable).toEqual(
      AchievementLevel.NoAchievement,
    );
    activityStore.weeks = createWeeks(1, take(VEGETABLES, 15));
    expect(activityStore.achievements.experimenterVegetable).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterLeafy', async () => {
    activityStore.weeks = createWeeks(1, take(LEAFIES, 14));
    expect(activityStore.achievements.experimenterLeafy).toEqual(AchievementLevel.NoAchievement);
    activityStore.weeks = createWeeks(1, take(LEAFIES, 15));
    expect(activityStore.achievements.experimenterLeafy).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterMushroom', async () => {
    activityStore.weeks = createWeeks(1, take(MUSHROOMS, 14));
    expect(activityStore.achievements.experimenterMushroom).toEqual(AchievementLevel.NoAchievement);
    activityStore.weeks = createWeeks(1, take(MUSHROOMS, 15));
    expect(activityStore.achievements.experimenterMushroom).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterBean', async () => {
    activityStore.weeks = createWeeks(1, take(BEANS, 14));
    expect(activityStore.achievements.experimenterBean).toEqual(AchievementLevel.NoAchievement);
    activityStore.weeks = createWeeks(1, take(BEANS, 15));
    expect(activityStore.achievements.experimenterBean).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterRoot', async () => {
    activityStore.weeks = createWeeks(1, take(ROOTS, 14));
    expect(activityStore.achievements.experimenterRoot).toEqual(AchievementLevel.NoAchievement);
    activityStore.weeks = createWeeks(1, take(ROOTS, 15));
    expect(activityStore.achievements.experimenterRoot).toBe(AchievementLevel.Gold);
  });

  it('advances experimenterGrain', async () => {
    activityStore.weeks = createWeeks(1, take(GRAINS, 14));
    expect(activityStore.achievements.experimenterGrain).toEqual(AchievementLevel.NoAchievement);
    activityStore.weeks = createWeeks(1, take(GRAINS, 15));
    expect(activityStore.achievements.experimenterGrain).toBe(AchievementLevel.Gold);
  });

  it('advances hot streak', async () => {
    // @ts-expect-error: getters are writable in tests
    activityStore.hotStreak = 4;
    expect(activityStore.achievements.hotStreak).toEqual(AchievementLevel.NoAchievement);
    // @ts-expect-error: getters are writable in tests
    activityStore.hotStreak = 5;
    expect(activityStore.achievements.hotStreak).toEqual(AchievementLevel.Bronze);
    // @ts-expect-error: getters are writable in tests
    activityStore.hotStreak = 10;
    expect(activityStore.achievements.hotStreak).toEqual(AchievementLevel.Silver);
    // @ts-expect-error: getters are writable in tests
    activityStore.hotStreak = 20;
    expect(activityStore.achievements.hotStreak).toEqual(AchievementLevel.Gold);
  });

  it('advances committed', async () => {
    activityStore.weeks = createWeeks(11);
    expect(activityStore.achievements.committed).toEqual(AchievementLevel.NoAchievement);
    activityStore.weeks = createWeeks(12);
    expect(activityStore.achievements.committed).toEqual(AchievementLevel.Bronze);
    activityStore.weeks = createWeeks(26);
    expect(activityStore.achievements.committed).toEqual(AchievementLevel.Silver);
    activityStore.weeks = createWeeks(52);
    expect(activityStore.achievements.committed).toEqual(AchievementLevel.Gold);
  });

  it('advances challengeAccepted', async () => {
    // @ts-expect-error: getters are writable in tests
    activityStore.completedChallenges = 4;
    expect(activityStore.achievements.challengeAccepted).toEqual(AchievementLevel.NoAchievement);
    // @ts-expect-error: getters are writable in tests
    activityStore.completedChallenges = 5;
    expect(activityStore.achievements.challengeAccepted).toEqual(AchievementLevel.Bronze);
    // @ts-expect-error: getters are writable in tests
    activityStore.completedChallenges = 10;
    expect(activityStore.achievements.challengeAccepted).toEqual(AchievementLevel.Silver);
    // @ts-expect-error: getters are writable in tests
    activityStore.completedChallenges = 20;
    expect(activityStore.achievements.challengeAccepted).toEqual(AchievementLevel.Gold);
  });

  it('advances thirtyVeggies', async () => {
    activityStore.weeks = createWeeks(1, take(ALL_VEGGIES, 29));
    expect(activityStore.achievements.thirtyVeggies).toEqual(AchievementLevel.NoAchievement);
    activityStore.weeks = createWeeks(1, take(ALL_VEGGIES, 30));
    expect(activityStore.achievements.thirtyVeggies).toBe(AchievementLevel.Gold);
    activityStore.weeks = createWeeks(1, take(ALL_VEGGIES, 40));
    expect(activityStore.achievements.thirtyVeggies).toBe(AchievementLevel.Platinum);
  });

  it('advances go nuts', async () => {
    activityStore.weeks = createWeeks(1, take(NUTS, 4));
    expect(activityStore.achievements.goNuts).toEqual(AchievementLevel.NoAchievement);
    activityStore.weeks = createWeeks(1, take(NUTS, 5));
    expect(activityStore.achievements.goNuts).toEqual(AchievementLevel.Gold);
  });

  it('advances lemons', async () => {
    activityStore.weeks = createWeeks(1, take(CITRUSES, 4));
    expect(activityStore.achievements.lemons).toEqual(AchievementLevel.NoAchievement);
    activityStore.weeks = createWeeks(1, take(CITRUSES, 5));
    expect(activityStore.achievements.lemons).toEqual(AchievementLevel.Gold);
  });

  it('advances tearnado', async () => {
    activityStore.weeks = createWeeks(1, take(ONIONS, 4));
    expect(activityStore.achievements.tearnado).toEqual(AchievementLevel.NoAchievement);
    activityStore.weeks = createWeeks(1, take(ONIONS, 5));
    expect(activityStore.achievements.tearnado).toEqual(AchievementLevel.Gold);
  });

  it('advances all on red', async () => {
    activityStore.weeks = createWeeks(1, take(RED_VEGGIES, 9));
    expect(activityStore.achievements.allOnRed).toEqual(AchievementLevel.NoAchievement);
    activityStore.weeks = createWeeks(1, take(RED_VEGGIES, 10));
    expect(activityStore.achievements.allOnRed).toEqual(AchievementLevel.Gold);
  });

  it('advances botanical berries', async () => {
    activityStore.weeks = createWeeks(1, take(BOTANICAL_BERRIES, 14));
    expect(activityStore.achievements.botanicalBerries).toEqual(AchievementLevel.NoAchievement);
    activityStore.weeks = createWeeks(1, take(BOTANICAL_BERRIES, 15));
    expect(activityStore.achievements.botanicalBerries).toEqual(AchievementLevel.Gold);
  });

  it('advances rainbow', async () => {
    activityStore.weeks = createWeeks(1, [
      ...take(FRUITS, 3),
      ...take(VEGETABLES, 3),
      ...take(LEAFIES, 3),
      ...take(ROOTS, 3),
      ...take(GRAINS, 3),
      ...take(BEANS, 3),
      ...take(MUSHROOMS, 2),
    ]);
    expect(activityStore.achievements.rainbow).toEqual(AchievementLevel.NoAchievement);
    activityStore.weeks = createWeeks(1, [
      ...take(FRUITS, 3),
      ...take(VEGETABLES, 3),
      ...take(LEAFIES, 3),
      ...take(ROOTS, 3),
      ...take(GRAINS, 3),
      ...take(BEANS, 3),
      ...take(MUSHROOMS, 3),
    ]);
    expect(activityStore.achievements.rainbow).toEqual(AchievementLevel.Gold);
  });

  it('advances thousands', async () => {
    // @ts-expect-error: getters are writable in tests
    activityStore.allVeggies = [...Array(999)];
    expect(activityStore.achievements.thousandsOdd).toEqual(AchievementLevel.NoAchievement);
    expect(activityStore.achievements.thousandsEven).toEqual(AchievementLevel.NoAchievement);
    // @ts-expect-error: getters are writable in tests
    activityStore.allVeggies = [...Array(1000)];
    expect(activityStore.achievements.thousandsOdd).toEqual(AchievementLevel.Platinum);
    expect(activityStore.achievements.thousandsEven).toEqual(AchievementLevel.NoAchievement);
    // @ts-expect-error: getters are writable in tests
    activityStore.allVeggies = [...Array(2000)];
    expect(activityStore.achievements.thousandsOdd).toEqual(AchievementLevel.NoAchievement);
    expect(activityStore.achievements.thousandsEven).toEqual(AchievementLevel.Platinum);
    // @ts-expect-error: getters are writable in tests
    activityStore.allVeggies = [...Array(2001)];
    expect(activityStore.achievements.thousandsOdd).toEqual(AchievementLevel.NoAchievement);
    expect(activityStore.achievements.thousandsEven).toEqual(AchievementLevel.Platinum);
  });

  it('advances overachiever', async () => {
    const thisWeek = DateTime.now().startOf('week');
    // Setup 30 veggies but no challenge completed
    activityStore.weeks = [
      {
        startDate: thisWeek,
        veggies: take(ALL_VEGGIES, 30),
        challenge: ALL_VEGGIES[ALL_VEGGIES.length - 1],
      },
    ];
    expect(activityStore.achievements.overachiever).toEqual(AchievementLevel.NoAchievement);

    // Setup challenge completed but not 30 veggies
    activityStore.weeks = [
      {
        startDate: thisWeek,
        veggies: ['apple'],
        challenge: 'apple',
      },
    ];
    expect(activityStore.achievements.overachiever).toEqual(AchievementLevel.NoAchievement);

    // Setup both 30 veggies AND challenge completed
    activityStore.weeks = [
      {
        startDate: thisWeek,
        veggies: take(ALL_VEGGIES, 30),
        challenge: ALL_VEGGIES[0],
      },
    ];
    expect(activityStore.achievements.overachiever).toEqual(AchievementLevel.Gold);
  });
});
