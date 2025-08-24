import {computed, type Ref} from 'vue';
import {countBy, intersection} from 'remeda';
import {BOTANICAL_BERRIES, CITRUSES, NUTS} from '@/utils/constants';
import {getCategoryForVeggie} from '@/utils/helpers';
import {Category, type Achievements} from '@/utils/types';

export function useAchievementCompletion(veggies: Ref<string[]>) {
  const degreeFormatter = (multiplier: number) => Math.floor(Math.min(multiplier * 360, 360));

  const weeklyCompletion = computed<Partial<Record<keyof Achievements, number>>>(() => {
    const groupedVeggies = countBy(veggies.value, getCategoryForVeggie);
    const categories = Object.values(Category);
    return {
      botanicalBerries: degreeFormatter(intersection(BOTANICAL_BERRIES, veggies.value).length / 15),
      lemons: degreeFormatter(intersection(CITRUSES, veggies.value).length / 5),
      goNuts: degreeFormatter(intersection(NUTS, veggies.value).length / 5),
      rainbow: degreeFormatter(
        categories.reduce(
          (count, current) =>
            groupedVeggies[current] && groupedVeggies[current] >= 3 ? count + 1 : count,
          0,
        ) / categories.length,
      ),
      thirtyVeggies: degreeFormatter(veggies.value.length / 30),
    };
  });
  return {weeklyCompletion};
}
