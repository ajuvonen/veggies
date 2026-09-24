import {describe, it, expect, beforeEach} from 'vitest';
import {take} from '@/test-utils';
import {AchievementLevel, type Achievements, type Week} from '@/types';
import {
  ALL_VEGGIES,
  BEANS,
  BOTANICAL_BERRIES,
  CITRUSES,
  FRUITS,
  GRAINS,
  HERBS,
  LEAFIES,
  MUSHROOMS,
  NUTS,
  ONIONS,
  ROOTS,
  VEGETABLES,
} from '@/utils/veggieDetails';
import {getAchievements} from '@/test-utils';
import {getWeekStart} from '@/utils/helpers';
import {useActivityStore} from '@/stores/activityStore';

const createWeeks = (amount: number, veggies: string[] = []): Week[] => {
  const weekStart = getWeekStart();
  return [...Array(amount)]
    .map((_, index) => ({
      startDate: weekStart.subtract({weeks: index}),
      veggies,
      challenge: 'cucumber',
    }))
    .reverse();
};

describe('achievements', () => {
  let activityStore: ReturnType<typeof useActivityStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
  });

  it('sets initial status', async () => {
    expect(activityStore.achievements).toEqual(getAchievements());
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

  it.each<{achievement: keyof Achievements; veggies: ReadonlySet<string>; threshold: number}>([
    {achievement: 'experimenterFruit', veggies: FRUITS, threshold: 15},
    {achievement: 'experimenterVegetable', veggies: VEGETABLES, threshold: 15},
    {achievement: 'experimenterLeafy', veggies: LEAFIES, threshold: 15},
    {achievement: 'experimenterMushroom', veggies: MUSHROOMS, threshold: 15},
    {achievement: 'experimenterBean', veggies: BEANS, threshold: 15},
    {achievement: 'experimenterRoot', veggies: ROOTS, threshold: 15},
    {achievement: 'experimenterGrain', veggies: GRAINS, threshold: 15},
    {achievement: 'botanicalBerries', veggies: BOTANICAL_BERRIES, threshold: 15},
    {achievement: 'goNuts', veggies: NUTS, threshold: 5},
    {achievement: 'herbalist', veggies: HERBS, threshold: 5},
    {achievement: 'lemons', veggies: CITRUSES, threshold: 5},
    {achievement: 'tearnado', veggies: ONIONS, threshold: 5},
  ])('advances $achievement at $threshold veggies', ({achievement, veggies, threshold}) => {
    activityStore.weeks = createWeeks(1, take(veggies, threshold - 1));
    expect(activityStore.achievements[achievement]).toEqual(AchievementLevel.NoAchievement);
    activityStore.weeks = createWeeks(1, take(veggies, threshold));
    expect(activityStore.achievements[achievement]).toEqual(AchievementLevel.Gold);
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
    const thisWeek = getWeekStart();
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
