import {describe, it, expect, beforeEach} from 'vitest';
import {DateTime} from 'luxon';
import {useActivityStore} from '@/stores/activityStore';
import {createPinia, setActivePinia} from 'pinia';

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
    activityStore.toggleIngredient('cucumber');
    activityStore.toggleIngredient('tomato');
    expect(activityStore.activity.length).toBe(2);
  });

  it('removes ingredients', () => {
    activityStore.toggleIngredient('cucumber');
    activityStore.toggleIngredient('cucumber');
    expect(activityStore.activity.length).toBe(0);
  });

  it('ingredient toggle does not affect previous week', () => {
    const lastWeekAction = {
      ingredient: 'tomato',
      date: DateTime.now().startOf('week').minus({weeks: 1}),
    };
    activityStore.activity.push(lastWeekAction);
    activityStore.toggleIngredient('tomato');
    expect(activityStore.activity.length).toBe(2);
    activityStore.toggleIngredient('tomato');
    expect(activityStore.activity[0]).toEqual(lastWeekAction);
  });
});
