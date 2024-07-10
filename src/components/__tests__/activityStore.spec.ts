import {describe, it, expect, beforeEach} from 'vitest';
import {DateTime} from 'luxon';
import {useActivityStore} from '@/stores/activityStore';
import {createPinia, setActivePinia} from 'pinia';
import {Category} from '@/utils/types';

describe('activityStore', () => {
  let activityStore: ReturnType<typeof useActivityStore>;
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia());
    activityStore = useActivityStore();
  });

  it('adds ingredients', () => {
    activityStore.toggleIngredient({key: 'cucumber', category: Category.Vegetable});
    activityStore.toggleIngredient({key: 'tomato', category: Category.Vegetable});
    expect(activityStore.activities.length).toBe(2);
  });

  it('removes ingredients', () => {
    activityStore.toggleIngredient({key: 'cucumber', category: Category.Vegetable});
    activityStore.toggleIngredient({key: 'cucumber', category: Category.Vegetable});
    expect(activityStore.activities.length).toBe(0);
  });

  it('ingredient toggle does not affect previous week', () => {
    const lastWeekAction = {
      ingredient: {key: 'tomato', category: Category.Vegetable},
      date: DateTime.now().startOf('week').minus({weeks: 1}),
    };
    activityStore.activities.push(lastWeekAction);
    activityStore.toggleIngredient({key: 'tomato', category: Category.Vegetable});
    expect(activityStore.activities.length).toBe(2);
    activityStore.toggleIngredient({key: 'tomato', category: Category.Vegetable});
    expect(activityStore.activities[0]).toEqual(lastWeekAction);
  });

  it("shows this week's ingredients", () => {
    activityStore.settings.startDate = DateTime.now().startOf('week').minus({weeks: 1});
    activityStore.activities.push({
      ingredient: {key: 'apple', category: Category.Fruit},
      date: DateTime.now().startOf('week').minus({days: 1}),
    });
    activityStore.toggleIngredient({key: 'cucumber', category: Category.Vegetable});
    activityStore.toggleIngredient({key: 'tomato', category: Category.Vegetable});
    expect(activityStore.getCurrentIngredients.length).toBe(2);
    expect(
      activityStore.getCurrentIngredients.some((ingredient) => ingredient.key === 'tomato'),
    ).toBe(true);

    expect(
      activityStore.getCurrentIngredients.some((ingredient) => ingredient.key === 'cucumber'),
    ).toBe(true);
  });

  it("shows specific week's ingredients", () => {
    activityStore.settings.startDate = DateTime.now().startOf('week').minus({weeks: 1});
    activityStore.activities.push({
      ingredient: {key: 'apple', category: Category.Fruit},
      date: DateTime.now().startOf('week').minus({days: 1}),
    });
    activityStore.toggleIngredient({key: 'cucumber', category: Category.Vegetable});
    activityStore.toggleIngredient({key: 'tomato', category: Category.Vegetable});

    expect(activityStore.getIngredientsForWeek(0).length).toBe(1);
    expect(
      activityStore.getIngredientsForWeek(0).some((ingredient) => ingredient.key === 'apple'),
    ).toBe(true);

    expect(activityStore.getIngredientsForWeek(1).length).toBe(2);
    expect(
      activityStore.getIngredientsForWeek(1).some((ingredient) => ingredient.key === 'tomato'),
    ).toBe(true);
    expect(
      activityStore.getIngredientsForWeek(1).some((ingredient) => ingredient.key === 'cucumber'),
    ).toBe(true);

    expect(activityStore.getIngredientsForWeek(2).length).toBe(0);
  });
});
