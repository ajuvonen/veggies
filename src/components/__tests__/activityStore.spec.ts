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
    activityStore.toggleIngredient('cucumber', Category.Vegetable);
    activityStore.toggleIngredient('tomato', Category.Vegetable);
    expect(activityStore.activities.length).toBe(2);
  });

  it('removes ingredients', () => {
    activityStore.toggleIngredient('cucumber', Category.Vegetable);
    activityStore.toggleIngredient('cucumber', Category.Vegetable);
    expect(activityStore.activities.length).toBe(0);
  });

  it('ingredient toggle does not affect previous week', () => {
    const lastWeekAction = {
      ingredient: {key: 'tomato', category: Category.Vegetable},
      date: DateTime.now().startOf('week').minus({weeks: 1}),
    };
    activityStore.activities.push(lastWeekAction);
    activityStore.toggleIngredient('tomato', Category.Vegetable);
    expect(activityStore.activities.length).toBe(2);
    activityStore.toggleIngredient('tomato', Category.Vegetable);
    expect(activityStore.activities[0]).toEqual(lastWeekAction);
  });

  it("shows this week's ingredients", () => {
    activityStore.settings.startDate = DateTime.now().startOf('week').minus({weeks: 1});
    activityStore.activities.push({
      ingredient: {key: 'apple', category: Category.Fruit},
      date: DateTime.now().startOf('week').minus({days: 1}),
    });
    activityStore.toggleIngredient('cucumber', Category.Vegetable);
    activityStore.toggleIngredient('tomato', Category.Vegetable);
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
    activityStore.toggleIngredient('cucumber', Category.Vegetable);
    activityStore.toggleIngredient('tomato', Category.Vegetable);

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

  it('shows favorites', () => {
    activityStore.settings.startDate = DateTime.now().startOf('week').minus({weeks: 3});
    activityStore.activities.push(
      {
        ingredient: {key: 'wheat', category: Category.Grain},
        date: DateTime.now().startOf('week').minus({days: 8}),
      },
      {
        ingredient: {key: 'wheat', category: Category.Grain},
        date: DateTime.now().startOf('week').minus({days: 15}),
      },
      {
        ingredient: {key: 'wheat', category: Category.Grain},
        date: DateTime.now().startOf('week').minus({days: 22}),
      },
      {
        ingredient: {key: 'apple', category: Category.Fruit},
        date: DateTime.now().startOf('week').minus({days: 8}),
      },
      {
        ingredient: {key: 'apple', category: Category.Fruit},
        date: DateTime.now().startOf('week').minus({days: 15}),
      },
      {
        ingredient: {key: 'cucumber', category: Category.Vegetable},
        date: DateTime.now().startOf('week').minus({days: 8}),
      },
    );

    expect(activityStore.getFavorites.length).toBe(3);
    expect(activityStore.getFavorites[0][0]).toBe('wheat');
    expect(activityStore.getFavorites[0][1]).toBe(Category.Grain);
    expect(activityStore.getFavorites[1][0]).toBe('apple');
    expect(activityStore.getFavorites[1][1]).toBe(Category.Fruit);
    expect(activityStore.getFavorites[2][0]).toBe('cucumber');
    expect(activityStore.getFavorites[2][1]).toBe(Category.Vegetable);
  });

  it('excludes this week from favorites', () => {
    activityStore.settings.startDate = DateTime.now().startOf('week').minus({weeks: 3});
    activityStore.activities.push(
      {
        ingredient: {key: 'wheat', category: Category.Grain},
        date: DateTime.now().startOf('week').minus({days: 8}),
      },
      {
        ingredient: {key: 'apple', category: Category.Fruit},
        date: DateTime.now().startOf('week').minus({days: 15}),
      },
      {
        ingredient: {key: 'cucumber', category: Category.Vegetable},
        date: DateTime.now().startOf('week').minus({days: 8}),
      },
    );

    activityStore.toggleIngredient('wheat', Category.Grain);
    activityStore.toggleIngredient('apple', Category.Fruit);

    expect(activityStore.getFavorites.length).toBe(1);
    expect(activityStore.getFavorites[0][0]).toBe('cucumber');
    expect(activityStore.getFavorites[0][1]).toBe(Category.Vegetable);
  });

  it('shows only ten favorites', () => {
    activityStore.settings.startDate = DateTime.now().startOf('week').minus({weeks: 1});
    const date = DateTime.now().startOf('week').minus({days: 1});
    activityStore.activities.push(
      {
        ingredient: {key: 'wheat', category: Category.Grain},
        date,
      },
      {
        ingredient: {key: 'rye', category: Category.Grain},
        date,
      },
      {
        ingredient: {key: 'rice', category: Category.Grain},
        date,
      },
      {
        ingredient: {key: 'apple', category: Category.Fruit},
        date,
      },
      {
        ingredient: {key: 'raspberry', category: Category.Fruit},
        date,
      },
      {
        ingredient: {key: 'cucumber', category: Category.Vegetable},
        date,
      },
      {
        ingredient: {key: 'tomato', category: Category.Vegetable},
        date,
      },
      {
        ingredient: {key: 'onion', category: Category.Root},
        date,
      },
      {
        ingredient: {key: 'garlic', category: Category.Root},
        date,
      },
      {
        ingredient: {key: 'endive', category: Category.Leafy},
        date,
      },
      {
        ingredient: {key: 'lettuce', category: Category.Leafy},
        date,
      },
    );

    expect(activityStore.getFavorites.length).toBe(10);
  });
});
