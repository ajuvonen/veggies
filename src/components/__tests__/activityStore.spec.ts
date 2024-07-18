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
    expect(activityStore.activities).toHaveLength(2);
    expect(activityStore.activities.some(({veggie}) => veggie === 'tomato')).toBe(true);
    expect(activityStore.activities.some(({veggie}) => veggie === 'cucumber')).toBe(true);
  });

  it('removes veggies', () => {
    activityStore.toggleVeggie('cucumber');
    activityStore.toggleVeggie('cucumber');
    expect(activityStore.activities).toHaveLength(0);
  });

  it('veggie toggle does not affect previous week', () => {
    const lastWeekAction = {
      veggie: 'tomato',
      date: DateTime.now().startOf('week').minus({weeks: 1}),
    };
    activityStore.activities.push(lastWeekAction);
    activityStore.toggleVeggie('tomato');
    expect(activityStore.activities).toHaveLength(2);
    activityStore.toggleVeggie('tomato');
    expect(activityStore.activities).toHaveLength(1);
    expect(activityStore.activities[0]).toEqual(lastWeekAction);
  });

  it('returns all veggies', () => {
    const now = DateTime.now();
    const lastWeek = now.minus({weeks: 1});
    activityStore.settings.startDate = DateTime.now().startOf('week').minus({weeks: 1});
    activityStore.activities.push(
      {
        veggie: 'apple',
        date: now,
      },
      {
        veggie: 'tomato',
        date: now,
      },
      {
        veggie: 'eggplant',
        date: lastWeek,
      },
      {
        veggie: 'broccoli',
        date: lastWeek,
      },
      {
        veggie: 'ginger',
        date: lastWeek,
      },
      {
        veggie: 'apple',
        date: lastWeek,
      },
    );

    const allVeggies = activityStore.allVeggies;
    expect(allVeggies).toEqual(['apple', 'tomato', 'eggplant', 'broccoli', 'ginger', 'apple']);
  });

  it("returns this week's veggies", () => {
    activityStore.settings.startDate = DateTime.now().startOf('week').minus({weeks: 1});
    activityStore.activities.push({
      veggie: 'apple',
      date: DateTime.now().startOf('week').minus({days: 1}),
    });
    activityStore.toggleVeggie('cucumber');
    activityStore.toggleVeggie('tomato');
    expect(activityStore.currentVeggies).toHaveLength(2);
    expect(activityStore.currentVeggies.includes('tomato')).toBe(true);
    expect(activityStore.currentVeggies.includes('cucumber')).toBe(true);
  });

  it("returns specific week's veggies", () => {
    activityStore.settings.startDate = DateTime.now().startOf('week').minus({weeks: 1});
    activityStore.activities.push({
      veggie: 'apple',
      date: DateTime.now().startOf('week').minus({days: 1}),
    });
    activityStore.toggleVeggie('cucumber');
    activityStore.toggleVeggie('tomato');

    expect(activityStore.veggiesForWeek(0)).toHaveLength(1);
    expect(activityStore.veggiesForWeek(0).includes('apple')).toBe(true);
    expect(activityStore.veggiesForWeek(1)).toHaveLength(2);
    expect(activityStore.veggiesForWeek(1).includes('tomato')).toBe(true);
    expect(activityStore.veggiesForWeek(1).includes('cucumber')).toBe(true);
    expect(activityStore.veggiesForWeek(2)).toHaveLength(0);
  });

  it('returns favorites', () => {
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

    expect(activityStore.favorites).toHaveLength(3);
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

    expect(activityStore.favorites).toHaveLength(1);
    expect(activityStore.favorites[0]).toBe('cucumber');
  });

  it('returns only ten favorites', () => {
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

    expect(activityStore.favorites).toHaveLength(10);
  });
});
