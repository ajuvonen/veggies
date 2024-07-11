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

  it('adds veggies', () => {
    activityStore.toggleVeggie('cucumber');
    activityStore.toggleVeggie('tomato');
    expect(activityStore.activities.length).toBe(2);
    expect(activityStore.activities.some(({veggie}) => veggie === 'tomato')).toBe(true);
    expect(activityStore.activities.some(({veggie}) => veggie === 'cucumber')).toBe(true);
  });

  it('removes veggies', () => {
    activityStore.toggleVeggie('cucumber');
    activityStore.toggleVeggie('cucumber');
    expect(activityStore.activities.length).toBe(0);
  });

  it('veggie toggle does not affect previous week', () => {
    const lastWeekAction = {
      veggie: 'tomato',
      date: DateTime.now().startOf('week').minus({weeks: 1}),
    };
    activityStore.activities.push(lastWeekAction);
    activityStore.toggleVeggie('tomato');
    expect(activityStore.activities.length).toBe(2);
    activityStore.toggleVeggie('tomato');
    expect(activityStore.activities.length).toBe(1);
    expect(activityStore.activities[0]).toEqual(lastWeekAction);
  });

  it("shows this week's veggies", () => {
    activityStore.settings.startDate = DateTime.now().startOf('week').minus({weeks: 1});
    activityStore.activities.push({
      veggie: 'apple',
      date: DateTime.now().startOf('week').minus({days: 1}),
    });
    activityStore.toggleVeggie('cucumber');
    activityStore.toggleVeggie('tomato');
    expect(activityStore.currentveggies.length).toBe(2);
    expect(activityStore.currentveggies.includes('tomato')).toBe(true);
    expect(activityStore.currentveggies.includes('cucumber')).toBe(true);
  });

  it("shows specific week's veggies", () => {
    activityStore.settings.startDate = DateTime.now().startOf('week').minus({weeks: 1});
    activityStore.activities.push({
      veggie: 'apple',
      date: DateTime.now().startOf('week').minus({days: 1}),
    });
    activityStore.toggleVeggie('cucumber');
    activityStore.toggleVeggie('tomato');

    expect(activityStore.veggiesForWeek(0).length).toBe(1);
    expect(activityStore.veggiesForWeek(0).includes('apple')).toBe(true);
    expect(activityStore.veggiesForWeek(1).length).toBe(2);
    expect(activityStore.veggiesForWeek(1).includes('tomato')).toBe(true);
    expect(activityStore.veggiesForWeek(1).includes('cucumber')).toBe(true);
    expect(activityStore.veggiesForWeek(2).length).toBe(0);
  });

  it('shows favorites', () => {
    activityStore.settings.startDate = DateTime.now().startOf('week').minus({weeks: 3});
    activityStore.activities.push(
      {
        veggie: 'wheat',
        date: DateTime.now().startOf('week').minus({days: 8}),
      },
      {
        veggie: 'wheat',
        date: DateTime.now().startOf('week').minus({days: 15}),
      },
      {
        veggie: 'wheat',
        date: DateTime.now().startOf('week').minus({days: 22}),
      },
      {
        veggie: 'apple',
        date: DateTime.now().startOf('week').minus({days: 8}),
      },
      {
        veggie: 'apple',
        date: DateTime.now().startOf('week').minus({days: 15}),
      },
      {
        veggie: 'cucumber',
        date: DateTime.now().startOf('week').minus({days: 8}),
      },
    );

    expect(activityStore.favorites.length).toBe(3);
    expect(activityStore.favorites[0]).toBe('wheat');
    expect(activityStore.favorites[1]).toBe('apple');
    expect(activityStore.favorites[2]).toBe('cucumber');
  });

  it('excludes this week from favorites', () => {
    activityStore.settings.startDate = DateTime.now().startOf('week').minus({weeks: 3});
    activityStore.activities.push(
      {
        veggie: 'wheat',
        date: DateTime.now().startOf('week').minus({days: 8}),
      },
      {
        veggie: 'apple',
        date: DateTime.now().startOf('week').minus({days: 15}),
      },
      {
        veggie: 'cucumber',
        date: DateTime.now().startOf('week').minus({days: 8}),
      },
    );

    activityStore.toggleVeggie('wheat');
    activityStore.toggleVeggie('apple');

    expect(activityStore.favorites.length).toBe(1);
    expect(activityStore.favorites[0]).toBe('cucumber');
  });

  it('shows only ten favorites', () => {
    activityStore.settings.startDate = DateTime.now().startOf('week').minus({weeks: 1});
    const date = DateTime.now().startOf('week').minus({days: 1});
    activityStore.activities.push(
      {
        veggie: 'wheat',
        date,
      },
      {
        veggie: 'rye',
        date,
      },
      {
        veggie: 'rice',
        date,
      },
      {
        veggie: 'apple',
        date,
      },
      {
        veggie: 'raspberry',
        date,
      },
      {
        veggie: 'cucumber',
        date,
      },
      {
        veggie: 'tomato',
        date,
      },
      {
        veggie: 'onion',
        date,
      },
      {
        veggie: 'garlic',
        date,
      },
      {
        veggie: 'endive',
        date,
      },
      {
        veggie: 'lettuce',
        date,
      },
    );

    expect(activityStore.favorites.length).toBe(10);
  });
});
