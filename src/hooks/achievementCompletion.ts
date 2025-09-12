import {computed, toValue, type MaybeRefOrGetter} from 'vue';
import {countBy, intersection} from 'remeda';
import {BOTANICAL_BERRIES, CITRUSES, NUTS, RED_VEGGIES} from '@/utils/veggieDetails';
import {getCategoryForVeggie} from '@/utils/helpers';
import {Category, type Achievements} from '@/utils/types';

export function useAchievementCompletion(
  veggies: MaybeRefOrGetter<string[]>,
  challenge?: MaybeRefOrGetter<string | undefined>,
) {
  const degreeFormatter = (multiplier: number) => Math.floor(Math.min(multiplier * 360, 360));

  const weeklyCompletion = computed<Partial<Record<keyof Achievements, number>>>(() => {
    const valueForVeggies = toValue(veggies);
    const valueForChallenge = toValue(challenge);
    const groupedVeggies = countBy(valueForVeggies, getCategoryForVeggie);
    const categories = Object.values(Category);
    const challengeCompleted = valueForChallenge
      ? valueForVeggies.includes(valueForChallenge)
      : false;

    // If challenge is completed, progress is based on veggie count / 30
    // If challenge not completed, max progress is 50% (180 degrees)
    const overachieverProgress = challengeCompleted
      ? Math.min(valueForVeggies.length / 30, 1)
      : Math.min(valueForVeggies.length / 30, 1) * 0.5;

    return {
      allOnRed: degreeFormatter(intersection(RED_VEGGIES, valueForVeggies).length / 10),
      botanicalBerries: degreeFormatter(
        intersection(BOTANICAL_BERRIES, valueForVeggies).length / 15,
      ),
      lemons: degreeFormatter(intersection(CITRUSES, valueForVeggies).length / 5),
      goNuts: degreeFormatter(intersection(NUTS, valueForVeggies).length / 5),
      overachiever: degreeFormatter(overachieverProgress),
      rainbow: degreeFormatter(
        categories.reduce(
          (count, current) =>
            groupedVeggies[current] && groupedVeggies[current] >= 3 ? count + 1 : count,
          0,
        ) / categories.length,
      ),
      thirtyVeggies: degreeFormatter(valueForVeggies.length / 30),
    };
  });
  return {weeklyCompletion};
}
