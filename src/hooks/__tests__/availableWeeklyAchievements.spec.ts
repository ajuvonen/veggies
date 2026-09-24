import {describe, it, expect, beforeEach} from 'vitest';
import {
  useAvailableWeeklyAchievements,
  WEEKLY_ACHIEVEMENTS,
} from '@/hooks/availableWeeklyAchievements';
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
import {useAppStateStore} from '@/stores/appStateStore';
import {withSetup, take} from '@/test-utils';

describe('availableWeeklyAchievements', () => {
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    appStateStore = useAppStateStore();
  });

  it('includes all achievements when no allergens are set', () => {
    const {availableWeeklyAchievements} = withSetup(useAvailableWeeklyAchievements);
    expect(availableWeeklyAchievements.value).toEqual(WEEKLY_ACHIEVEMENTS);
  });

  const thresholds: {achievement: string; veggies: Iterable<string>; threshold: number}[] = [
    {achievement: 'goNuts', veggies: NUTS, threshold: 5},
    {achievement: 'herbalist', veggies: HERBS, threshold: 5},
    {achievement: 'tearnado', veggies: ONIONS, threshold: 5},
    {achievement: 'lemons', veggies: CITRUSES, threshold: 5},
    {achievement: 'botanicalBerries', veggies: BOTANICAL_BERRIES, threshold: 15},
    {achievement: 'overachiever', veggies: ALL_VEGGIES, threshold: 30},
    {achievement: 'thirtyVeggies', veggies: ALL_VEGGIES, threshold: 30},
  ];

  it.each(thresholds)(
    'excludes $achievement when fewer than $threshold veggies are available',
    ({achievement, veggies, threshold}) => {
      appStateStore.settings.allergens = take(veggies, [...veggies].length - (threshold - 1));
      const {availableWeeklyAchievements} = withSetup(useAvailableWeeklyAchievements);
      expect(availableWeeklyAchievements.value).not.toContain(achievement);
    },
  );

  it.each(thresholds)(
    'includes $achievement when exactly $threshold veggies are available',
    ({achievement, veggies, threshold}) => {
      appStateStore.settings.allergens = take(veggies, [...veggies].length - threshold);
      const {availableWeeklyAchievements} = withSetup(useAvailableWeeklyAchievements);
      expect(availableWeeklyAchievements.value).toContain(achievement);
    },
  );

  it('excludes rainbow when fewer than 3 items are available in a category', () => {
    appStateStore.settings.allergens = take(MUSHROOMS, MUSHROOMS.size - 2);
    const {availableWeeklyAchievements} = withSetup(useAvailableWeeklyAchievements);
    expect(availableWeeklyAchievements.value).not.toContain('rainbow');
  });

  it('includes rainbow when at least 3 items are available in each category', () => {
    appStateStore.settings.allergens = [
      ...take(FRUITS, FRUITS.size - 3),
      ...take(VEGETABLES, VEGETABLES.size - 3),
      ...take(LEAFIES, LEAFIES.size - 3),
      ...take(ROOTS, ROOTS.size - 3),
      ...take(BEANS, BEANS.size - 3),
      ...take(GRAINS, GRAINS.size - 3),
      ...take(MUSHROOMS, MUSHROOMS.size - 3),
    ];
    const {availableWeeklyAchievements} = withSetup(useAvailableWeeklyAchievements);
    expect(availableWeeklyAchievements.value).toContain('rainbow');
  });

  it('is reactive to allergen changes', () => {
    const {availableWeeklyAchievements} = withSetup(useAvailableWeeklyAchievements);

    expect(availableWeeklyAchievements.value).toContain('goNuts');

    appStateStore.settings.allergens = take(NUTS, 8);
    expect(availableWeeklyAchievements.value).not.toContain('goNuts');

    appStateStore.settings.allergens = [];
    expect(availableWeeklyAchievements.value).toContain('goNuts');
  });
});
