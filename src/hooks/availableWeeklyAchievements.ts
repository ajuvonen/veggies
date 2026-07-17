import {computed} from 'vue';
import {
  BEANS,
  BOTANICAL_BERRIES,
  CITRUSES,
  FRUITS,
  GRAINS,
  LEAFIES,
  MUSHROOMS,
  NUTS,
  ONIONS,
  ROOTS,
  VEGETABLES,
} from '@/utils/veggieDetails';
import {setIntersection} from '@/utils/helpers';
import {Category, type WeeklyAchievements} from '@/types';
import {useAvailableVeggies} from '@/hooks/availableVeggies';

export const WEEKLY_ACHIEVEMENTS = [
  'botanicalBerries',
  'goNuts',
  'lemons',
  'overachiever',
  'rainbow',
  'tearnado',
  'thirtyVeggies',
] as const satisfies (keyof WeeklyAchievements)[];

const categorySets = {
  [Category.Fruit]: FRUITS,
  [Category.Vegetable]: VEGETABLES,
  [Category.Leafy]: LEAFIES,
  [Category.Root]: ROOTS,
  [Category.Bean]: BEANS,
  [Category.Grain]: GRAINS,
  [Category.Mushroom]: MUSHROOMS,
} as const satisfies Record<Category, ReadonlySet<string>>;

const achievementAvailability: Record<
  keyof WeeklyAchievements,
  (availableVeggies: string[]) => boolean
> = {
  botanicalBerries: (availableVeggies) =>
    setIntersection(BOTANICAL_BERRIES, availableVeggies).length >= 15,
  goNuts: (availableVeggies) => setIntersection(NUTS, availableVeggies).length >= 5,
  lemons: (availableVeggies) => setIntersection(CITRUSES, availableVeggies).length >= 5,
  overachiever: (availableVeggies) => availableVeggies.length >= 30,
  rainbow: (availableVeggies) =>
    Object.values(Category).every(
      (category) => setIntersection(categorySets[category], availableVeggies).length >= 3,
    ),
  tearnado: (availableVeggies) => setIntersection(ONIONS, availableVeggies).length >= 5,
  thirtyVeggies: (availableVeggies) => availableVeggies.length >= 30,
};

export const useAvailableWeeklyAchievements = () => {
  const {availableVeggies} = useAvailableVeggies();

  const availableWeeklyAchievements = computed(() =>
    WEEKLY_ACHIEVEMENTS.filter((key) => achievementAvailability[key](availableVeggies.value)),
  );

  return {availableWeeklyAchievements};
};
