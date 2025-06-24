import {storeToRefs} from 'pinia';
import {useAppStateStore} from '@/stores/appStateStore';
import {difference} from 'remeda';
import {
  ALL_VEGGIES,
  FRUITS,
  VEGETABLES,
  LEAFIES,
  ROOTS,
  BEANS,
  GRAINS,
  MUSHROOMS,
} from '@/utils/constants';
import {computed} from 'vue';

export function useAvailableVeggies() {
  const {settings} = storeToRefs(useAppStateStore());
  const availableBeans = computed(() => difference(BEANS, settings.value.allergens));
  const availableFruits = computed(() => difference(FRUITS, settings.value.allergens));
  const availableGrains = computed(() => difference(GRAINS, settings.value.allergens));
  const availableLeafies = computed(() => difference(LEAFIES, settings.value.allergens));
  const availableMushrooms = computed(() => difference(MUSHROOMS, settings.value.allergens));
  const availableRoots = computed(() => difference(ROOTS, settings.value.allergens));
  const availableVegetables = computed(() => difference(VEGETABLES, settings.value.allergens));
  const availableVeggies = computed(() => difference(ALL_VEGGIES, settings.value.allergens));
  return {
    availableBeans,
    availableFruits,
    availableGrains,
    availableLeafies,
    availableMushrooms,
    availableRoots,
    availableVegetables,
    availableVeggies,
  };
}
