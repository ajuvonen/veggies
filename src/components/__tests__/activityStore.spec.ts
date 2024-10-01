import {describe, it, expect, beforeEach} from 'vitest';
import {DateTime} from 'luxon';
import {useActivityStore} from '@/stores/activityStore';
import {createPinia, setActivePinia} from 'pinia';
import type {Week} from '@/utils/types';

describe('activityStore', () => {
  const thisWeek = DateTime.now().startOf('week');
  const lastWeek = thisWeek.minus({weeks: 1});
  const twoWeeksAgo = thisWeek.minus({weeks: 2});
  const threeWeeksAgo = thisWeek.minus({weeks: 3});
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
    expect(activityStore.weeks).toHaveLength(1);
    expect(activityStore.challenges).toHaveLength(1);
    expect(activityStore.weeks[0].veggies).toEqual(['cucumber', 'tomato']);
  });

  it('removes veggies', () => {
    activityStore.toggleVeggie('cucumber');
    activityStore.toggleVeggie('cucumber');
    expect(activityStore.weeks).toHaveLength(1);
    expect(activityStore.challenges).toHaveLength(1);
    expect(activityStore.weeks[0].veggies).toHaveLength(0);
  });

  it('veggie toggle does not affect previous week', () => {
    const lastWeekItem: Week = {
      veggies: ['tomato'],
      startDate: lastWeek,
    };
    activityStore.weeks.push(lastWeekItem);
    activityStore.toggleVeggie('tomato');
    expect(activityStore.weeks).toHaveLength(2);
    expect(activityStore.weeks[1].veggies).toHaveLength(1);
    activityStore.toggleVeggie('tomato');
    expect(activityStore.weeks[1].veggies).toHaveLength(0);
    expect(activityStore.weeks[0]).toEqual(lastWeekItem);
  });

  it('returns all veggies', () => {
    activityStore.startDate = lastWeek;
    activityStore.weeks.push(
      {
        startDate: lastWeek,
        veggies: ['eggplant', 'broccoli', 'ginger', 'apple'],
      },
      {
        startDate: thisWeek,
        veggies: ['apple', 'tomato'],
      },
    );

    const allVeggies = activityStore.allVeggies;
    expect(allVeggies).toEqual(['eggplant', 'broccoli', 'ginger', 'apple', 'apple', 'tomato']);
  });

  it("returns this week's veggies", () => {
    activityStore.startDate = lastWeek;
    activityStore.weeks.push(
      {
        startDate: lastWeek,
        veggies: ['cucumber', 'tomato'],
      },
      {
        startDate: thisWeek,
        veggies: ['cucumber', 'tomato'],
      },
    );
    expect(activityStore.currentVeggies).toEqual(['cucumber', 'tomato']);
  });

  it('returns completed challenges', () => {
    activityStore.startDate = twoWeeksAgo;
    activityStore.weeks.push(
      {
        startDate: twoWeeksAgo,
        veggies: ['cucumber'],
      },
      {
        startDate: lastWeek,
        veggies: ['wheat', 'rye', 'strawberry'],
      },
      {
        startDate: thisWeek,
        veggies: ['rice', 'leek'],
      },
    );
    activityStore.challenges.push(
      {
        startDate: twoWeeksAgo,
        veggie: 'cucumber',
      },
      {
        startDate: lastWeek,
        veggie: 'leek',
      },
      {
        startDate: thisWeek,
        veggie: 'rice',
      },
    );

    expect(activityStore.completedChallenges).toEqual(2);
  });

  it("sets this week's veggies", () => {
    activityStore.startDate = lastWeek;
    activityStore.weeks.push(
      {
        startDate: lastWeek,
        veggies: ['cucumber', 'longan'],
      },
      {
        startDate: thisWeek,
        veggies: ['cucumber', 'tomato'],
      },
    );
    activityStore.currentVeggies = ['banana', 'apple'];
    expect(activityStore.currentVeggies).toEqual(['banana', 'apple']);
    expect(activityStore.weeks[0].veggies).toEqual(['cucumber', 'longan']);
  });

  it("sets this week's veggies from empty", () => {
    activityStore.startDate = lastWeek;
    activityStore.weeks.push({
      startDate: lastWeek,
      veggies: ['cucumber', 'longan'],
    });
    activityStore.currentVeggies = ['banana', 'apple'];
    expect(activityStore.currentVeggies).toEqual(['banana', 'apple']);
    expect(activityStore.weeks[0].veggies).toEqual(['cucumber', 'longan']);
    expect(activityStore.weeks[1].startDate).toEqual(thisWeek);
  });

  it("returns specific week's veggies", () => {
    activityStore.startDate = lastWeek;
    activityStore.weeks.push(
      {
        veggies: ['apple'],
        startDate: lastWeek,
      },
      {
        veggies: ['cucumber', 'tomato'],
        startDate: thisWeek,
      },
    );

    expect(activityStore.veggiesForWeek(lastWeek)).toEqual(['apple']);
    expect(activityStore.veggiesForWeek(thisWeek)).toEqual(['cucumber', 'tomato']);
    expect(activityStore.veggiesForWeek(threeWeeksAgo)).toEqual([]);
  });

  it("returns this week's challenge", () => {
    activityStore.startDate = lastWeek;

    activityStore.challenges.push({
      startDate: lastWeek,
      veggie: 'cucumber',
    });

    expect(activityStore.currentChallenge).toBe(undefined);

    activityStore.challenges.push({
      startDate: thisWeek,
      veggie: 'tomato',
    });

    expect(activityStore.currentChallenge).toBe('tomato');
  });

  it('returns favorites', () => {
    activityStore.startDate = threeWeeksAgo;
    activityStore.weeks.push(
      {
        startDate: threeWeeksAgo,
        veggies: ['wheat', 'apple', 'cucumber'],
      },
      {
        startDate: twoWeeksAgo,
        veggies: ['wheat', 'apple'],
      },
      {
        startDate: lastWeek,
        veggies: ['cucumber'],
      },
    );

    expect(activityStore.favorites).toEqual(['wheat', 'apple', 'cucumber']);
  });

  it('excludes this week from favorites', () => {
    activityStore.startDate = twoWeeksAgo;
    activityStore.weeks.push(
      {
        veggies: ['wheat', 'apple'],
        startDate: thisWeek,
      },
      {
        veggies: ['cucumber', 'wheat'],
        startDate: lastWeek,
      },
      {
        veggies: ['apple'],
        startDate: twoWeeksAgo,
      },
    );

    expect(activityStore.favorites).toEqual(['cucumber']);
  });

  it('returns only ten favorites', () => {
    activityStore.startDate = lastWeek;
    activityStore.weeks.push({
      veggies: [
        'wheat',
        'rye',
        'rice',
        'apple',
        'raspberry',
        'cucumber',
        'tomato',
        'onion',
        'garlic',
        'endive',
        'lettuce',
      ],
      startDate: lastWeek,
    });

    expect(activityStore.favorites).toHaveLength(10);
  });

  it('returns unique veggies', () => {
    activityStore.startDate = lastWeek;
    activityStore.weeks.push(
      {
        veggies: ['tomato', 'apple', 'banana'],
        startDate: lastWeek,
      },
      {
        veggies: ['apple', 'tomato', 'cherry'],
        startDate: thisWeek,
      },
    );

    expect(activityStore.uniqueVeggies).toEqual(['tomato', 'apple', 'banana', 'cherry']);
  });

  it('resets the store', () => {
    activityStore.startDate = thisWeek;
    activityStore.weeks.push({
      startDate: thisWeek,
      veggies: ['cucumber', 'tomato'],
    });

    activityStore.$reset();
    expect(activityStore.startDate).toBe(null);
    expect(activityStore.weeks).toHaveLength(0);
  });

  it('returns 0 as streak length', () => {
    activityStore.startDate = thisWeek;
    activityStore.weeks.push({
      startDate: thisWeek,
      veggies: [...Array(29)],
    });
    expect(activityStore.hotStreak).toBe(0);
  });

  it('returns hot streak length with gaps', () => {
    activityStore.startDate = threeWeeksAgo;
    activityStore.weeks.push(
      {
        startDate: threeWeeksAgo,
        veggies: [...Array(30)],
      },
      {
        startDate: twoWeeksAgo,
        veggies: [...Array(30)],
      },
      {
        startDate: thisWeek,
        veggies: [...Array(30)],
      },
    );
    expect(activityStore.hotStreak).toBe(2);
  });

  it('returns longest hot streak length', () => {
    activityStore.startDate = threeWeeksAgo.minus({weeks: 3});
    activityStore.weeks.push(
      {
        startDate: threeWeeksAgo.minus({weeks: 3}),
        veggies: [...Array(30)],
      },
      {
        startDate: threeWeeksAgo.minus({weeks: 2}),
        veggies: [...Array(30)],
      },
      {
        startDate: threeWeeksAgo.minus({weeks: 1}),
        veggies: [...Array(30)],
      },
      {
        startDate: threeWeeksAgo,
        veggies: [...Array(30)],
      },
      {
        startDate: twoWeeksAgo,
        veggies: [],
      },
      {
        startDate: lastWeek,
        veggies: [...Array(30)],
      },
      {
        startDate: thisWeek,
        veggies: [...Array(30)],
      },
    );
    expect(activityStore.hotStreak).toBe(4);
  });

  it('missing week ends streak', () => {
    activityStore.startDate = twoWeeksAgo;
    activityStore.weeks.push(
      {
        startDate: twoWeeksAgo,
        veggies: [...Array(30)],
      },
      {
        startDate: thisWeek,
        veggies: [...Array(30)],
      },
    );
    expect(activityStore.hotStreak).toBe(1);
  });

  it('too few veggies ends streak', () => {
    activityStore.startDate = twoWeeksAgo;
    activityStore.weeks.push(
      {
        startDate: twoWeeksAgo,
        veggies: [...Array(30)],
      },
      {
        startDate: lastWeek,
        veggies: [...Array(29)],
      },
      {
        startDate: thisWeek,
        veggies: [...Array(30)],
      },
    );
    expect(activityStore.hotStreak).toBe(1);
  });

  it('returns amount of weeks with over 30 veggies', () => {
    activityStore.startDate = twoWeeksAgo;
    activityStore.weeks.push(
      {
        startDate: twoWeeksAgo,
        veggies: [...Array(30)],
      },
      {
        startDate: lastWeek,
        veggies: [...Array(31)],
      },
      {
        startDate: thisWeek,
        veggies: [...Array(29)],
      },
    );

    expect(activityStore.over30Veggies).toBe(2);
  });

  it('returns the amount of most veggies in a week', () => {
    activityStore.startDate = twoWeeksAgo;
    activityStore.weeks.push(
      {
        startDate: twoWeeksAgo,
        veggies: [...Array(12)],
      },
      {
        startDate: lastWeek,
        veggies: [...Array(6)],
      },
      {
        startDate: thisWeek,
        veggies: [],
      },
    );

    expect(activityStore.atMostVeggies).toBe(12);
  });

  it('returns all weekStarts from the start date', async () => {
    activityStore.startDate = thisWeek;
    expect(activityStore.getWeekStarts).toEqual([thisWeek]);
    activityStore.startDate = lastWeek;
    expect(activityStore.getWeekStarts).toEqual([lastWeek, thisWeek]);
    activityStore.startDate = thisWeek.minus({weeks: 5});
    expect(activityStore.getWeekStarts.length).toBe(6);
  });

  it('resets the store', () => {
    activityStore.startDate = thisWeek;
    activityStore.weeks.push({
      startDate: thisWeek,
      veggies: ['cucumber', 'tomato'],
    });
    activityStore.challenges.push({
      startDate: thisWeek,
      veggie: 'longan',
    });
    activityStore.$reset();
    expect(activityStore.startDate).toBe(null);
    expect(activityStore.weeks).toHaveLength(0);
  });
});
