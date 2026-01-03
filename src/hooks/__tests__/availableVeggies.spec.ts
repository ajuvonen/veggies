import {describe, it, expect, beforeEach} from 'vitest';
import {useAvailableVeggies} from '@/hooks/availableVeggies';
import {
  ALL_VEGGIES,
  BEANS,
  FRUITS,
  GRAINS,
  LEAFIES,
  MUSHROOMS,
  ROOTS,
  VEGETABLES,
} from '@/utils/veggieDetails';
import {useAppStateStore} from '@/stores/appStateStore';
import {withSetup} from './testHelpers';

describe('availableVeggies', () => {
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    appStateStore = useAppStateStore();
  });

  it('returns available veggies', () => {
    appStateStore.settings.allergens = [
      'green bean',
      'apple',
      'peanut',
      'romaine',
      'shiitake',
      'carrot',
      'asparagus',
    ];
    const {
      availableVeggies,
      availableBeans,
      availableFruits,
      availableGrains,
      availableLeafies,
      availableMushrooms,
      availableRoots,
      availableVegetables,
    } = withSetup(useAvailableVeggies);
    expect(availableVeggies.value.length).toBe(ALL_VEGGIES.length - 7);
    expect(availableBeans.value.length).toBe(BEANS.length - 1);
    expect(availableFruits.value.length).toBe(FRUITS.length - 1);
    expect(availableGrains.value.length).toBe(GRAINS.length - 1);
    expect(availableLeafies.value.length).toBe(LEAFIES.length - 1);
    expect(availableMushrooms.value.length).toBe(MUSHROOMS.length - 1);
    expect(availableRoots.value.length).toBe(ROOTS.length - 1);
    expect(availableVegetables.value.length).toBe(VEGETABLES.length - 1);
  });

  it('returns all veggies if no allergens', () => {
    const {
      availableVeggies,
      availableBeans,
      availableFruits,
      availableGrains,
      availableLeafies,
      availableMushrooms,
      availableRoots,
      availableVegetables,
    } = withSetup(useAvailableVeggies);
    expect(availableVeggies.value.length).toBe(ALL_VEGGIES.length);
    expect(availableBeans.value.length).toBe(BEANS.length);
    expect(availableFruits.value.length).toBe(FRUITS.length);
    expect(availableGrains.value.length).toBe(GRAINS.length);
    expect(availableLeafies.value.length).toBe(LEAFIES.length);
    expect(availableMushrooms.value.length).toBe(MUSHROOMS.length);
    expect(availableRoots.value.length).toBe(ROOTS.length);
    expect(availableVegetables.value.length).toBe(VEGETABLES.length);
  });

  it('returns empty if no available veggies', () => {
    appStateStore.settings.allergens = [...ALL_VEGGIES];
    const {
      availableVeggies,
      availableBeans,
      availableFruits,
      availableGrains,
      availableLeafies,
      availableMushrooms,
      availableRoots,
      availableVegetables,
    } = withSetup(useAvailableVeggies);
    expect(availableVeggies.value.length).toBe(0);
    expect(availableBeans.value.length).toBe(0);
    expect(availableFruits.value.length).toBe(0);
    expect(availableGrains.value.length).toBe(0);
    expect(availableLeafies.value.length).toBe(0);
    expect(availableMushrooms.value.length).toBe(0);
    expect(availableRoots.value.length).toBe(0);
    expect(availableVegetables.value.length).toBe(0);
  });
});
