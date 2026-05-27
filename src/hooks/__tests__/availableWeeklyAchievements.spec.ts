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
  LEAFIES,
  MUSHROOMS,
  NUTS,
  ONIONS,
  RED_VEGGIES,
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

  it('excludes goNuts when fewer than 5 nuts are available', () => {
    appStateStore.settings.allergens = take(NUTS, NUTS.size - 4);
    const {availableWeeklyAchievements} = withSetup(useAvailableWeeklyAchievements);
    expect(availableWeeklyAchievements.value).not.toContain('goNuts');
  });

  it('includes goNuts when exactly 5 nuts are available', () => {
    appStateStore.settings.allergens = take(NUTS, NUTS.size - 5);
    const {availableWeeklyAchievements} = withSetup(useAvailableWeeklyAchievements);
    expect(availableWeeklyAchievements.value).toContain('goNuts');
  });

  it('excludes tearnado when fewer than 5 onions are available', () => {
    appStateStore.settings.allergens = take(ONIONS, ONIONS.size - 4);
    const {availableWeeklyAchievements} = withSetup(useAvailableWeeklyAchievements);
    expect(availableWeeklyAchievements.value).not.toContain('tearnado');
  });

  it('includes tearnado when exactly 5 onions are available', () => {
    appStateStore.settings.allergens = take(ONIONS, ONIONS.size - 5);
    const {availableWeeklyAchievements} = withSetup(useAvailableWeeklyAchievements);
    expect(availableWeeklyAchievements.value).toContain('tearnado');
  });

  it('excludes lemons when fewer than 5 citruses are available', () => {
    appStateStore.settings.allergens = take(CITRUSES, CITRUSES.size - 4);
    const {availableWeeklyAchievements} = withSetup(useAvailableWeeklyAchievements);
    expect(availableWeeklyAchievements.value).not.toContain('lemons');
  });

  it('includes lemons when exactly 5 citruses are available', () => {
    appStateStore.settings.allergens = take(CITRUSES, CITRUSES.size - 5);
    const {availableWeeklyAchievements} = withSetup(useAvailableWeeklyAchievements);
    expect(availableWeeklyAchievements.value).toContain('lemons');
  });

  it('excludes allOnRed when fewer than 10 red veggies are available', () => {
    appStateStore.settings.allergens = take(RED_VEGGIES, RED_VEGGIES.size - 9);
    const {availableWeeklyAchievements} = withSetup(useAvailableWeeklyAchievements);
    expect(availableWeeklyAchievements.value).not.toContain('allOnRed');
  });

  it('includes allOnRed when exactly 10 red veggies are available', () => {
    appStateStore.settings.allergens = take(RED_VEGGIES, RED_VEGGIES.size - 10);
    const {availableWeeklyAchievements} = withSetup(useAvailableWeeklyAchievements);
    expect(availableWeeklyAchievements.value).toContain('allOnRed');
  });

  it('excludes botanicalBerries when fewer than 15 botanical berries are available', () => {
    appStateStore.settings.allergens = take(BOTANICAL_BERRIES, BOTANICAL_BERRIES.size - 14);
    const {availableWeeklyAchievements} = withSetup(useAvailableWeeklyAchievements);
    expect(availableWeeklyAchievements.value).not.toContain('botanicalBerries');
  });

  it('includes botanicalBerries when exactly 15 botanical berries are available', () => {
    appStateStore.settings.allergens = take(BOTANICAL_BERRIES, BOTANICAL_BERRIES.size - 15);
    const {availableWeeklyAchievements} = withSetup(useAvailableWeeklyAchievements);
    expect(availableWeeklyAchievements.value).toContain('botanicalBerries');
  });

  it('excludes overachiever and thirtyVeggies when fewer than 30 veggies are available', () => {
    appStateStore.settings.allergens = take(ALL_VEGGIES, ALL_VEGGIES.length - 29);
    const {availableWeeklyAchievements} = withSetup(useAvailableWeeklyAchievements);
    expect(availableWeeklyAchievements.value).not.toContain('overachiever');
    expect(availableWeeklyAchievements.value).not.toContain('thirtyVeggies');
  });

  it('includes overachiever and thirtyVeggies when exactly 30 veggies are available', () => {
    appStateStore.settings.allergens = take(ALL_VEGGIES, ALL_VEGGIES.length - 30);
    const {availableWeeklyAchievements} = withSetup(useAvailableWeeklyAchievements);
    expect(availableWeeklyAchievements.value).toContain('overachiever');
    expect(availableWeeklyAchievements.value).toContain('thirtyVeggies');
  });

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
