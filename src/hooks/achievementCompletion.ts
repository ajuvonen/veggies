import {computed, toValue, type MaybeRefOrGetter} from 'vue';
import {countBy} from 'remeda';
import {BOTANICAL_BERRIES, CITRUSES, HERBS, NUTS, ONIONS} from '@/utils/veggieDetails';
import {getCategoryForVeggie, setIntersection} from '@/utils/helpers';
import {Category, type WeeklyAchievements} from '@/types';

export function useAchievementCompletion(
  veggies: MaybeRefOrGetter<string[]>,
  challenge?: MaybeRefOrGetter<string | undefined>,
) {
  const degreeFormatter = (multiplier: number) => Math.floor(Math.min(multiplier * 360, 360));

  const weeklyCompletion = computed<Record<keyof WeeklyAchievements, number>>(() => {
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
      botanicalBerries: degreeFormatter(
        setIntersection(BOTANICAL_BERRIES, valueForVeggies).length / 15,
      ),
      goNuts: degreeFormatter(setIntersection(NUTS, valueForVeggies).length / 5),
      herbal: degreeFormatter(setIntersection(HERBS, valueForVeggies).length / 5),
      lemons: degreeFormatter(setIntersection(CITRUSES, valueForVeggies).length / 5),
      overachiever: degreeFormatter(overachieverProgress),
      rainbow: degreeFormatter(
        categories.reduce(
          (count, current) =>
            groupedVeggies[current] && groupedVeggies[current] >= 3 ? count + 1 : count,
          0,
        ) / categories.length,
      ),
      tearnado: degreeFormatter(setIntersection(ONIONS, valueForVeggies).length / 5),
      thirtyVeggies: degreeFormatter(valueForVeggies.length / 30),
    };
  });
  return {weeklyCompletion};
}
