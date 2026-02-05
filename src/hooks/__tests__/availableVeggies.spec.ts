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
import {withSetup} from '@/test-utils';

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
    expect(availableBeans.value.length).toBe(BEANS.size - 1);
    expect(availableFruits.value.length).toBe(FRUITS.size - 1);
    expect(availableGrains.value.length).toBe(GRAINS.size - 1);
    expect(availableLeafies.value.length).toBe(LEAFIES.size - 1);
    expect(availableMushrooms.value.length).toBe(MUSHROOMS.size - 1);
    expect(availableRoots.value.length).toBe(ROOTS.size - 1);
    expect(availableVegetables.value.length).toBe(VEGETABLES.size - 1);
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
    expect(availableBeans.value.length).toBe(BEANS.size);
    expect(availableFruits.value.length).toBe(FRUITS.size);
    expect(availableGrains.value.length).toBe(GRAINS.size);
    expect(availableLeafies.value.length).toBe(LEAFIES.size);
    expect(availableMushrooms.value.length).toBe(MUSHROOMS.size);
    expect(availableRoots.value.length).toBe(ROOTS.size);
    expect(availableVegetables.value.length).toBe(VEGETABLES.size);
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
