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
});
