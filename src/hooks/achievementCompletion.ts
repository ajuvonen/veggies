import {BOTANICAL_BERRIES, NUTS, RED_VEGGIES} from '@/utils/constants';
import type {Achievements} from '@/utils/types';
import {intersection} from 'remeda';
import {computed, type Ref} from 'vue';

export function useAchievementCompletion(veggies: Ref<string[]>) {
  const degreeFormatter = (multiplier: number) => Math.floor(Math.min(multiplier * 360, 360));

  const weeklyCompletion = computed<Partial<Record<keyof Achievements, number>>>(() => ({
    allOnRed: degreeFormatter(intersection(RED_VEGGIES, veggies.value).length / 10),
    botanicalBerries: degreeFormatter(intersection(BOTANICAL_BERRIES, veggies.value).length / 15),
    goNuts: degreeFormatter(intersection(NUTS, veggies.value).length / 5),
    thirtyVeggies: degreeFormatter(veggies.value.length / 30),
  }));
  return {weeklyCompletion};
}
