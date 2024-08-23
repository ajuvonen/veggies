import {describe, it, expect, beforeEach} from 'vitest';
import {DateTime} from 'luxon';
import {useActivityStore} from '@/stores/activityStore';
import {createPinia, setActivePinia} from 'pinia';
import {AchievementLevel, type Week} from '@/utils/types';

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
    expect(activityStore.weeks[0].veggies).toEqual(['cucumber', 'tomato']);
  });

  it('removes veggies', () => {
    activityStore.toggleVeggie('cucumber');
    activityStore.toggleVeggie('cucumber');
    expect(activityStore.weeks).toHaveLength(1);
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
    activityStore.achievements.completionist = AchievementLevel.Gold;
    activityStore.$reset();
    expect(activityStore.startDate).toBe(null);
    expect(activityStore.weeks).toHaveLength(0);
    expect(activityStore.achievements).toEqual({
      completionist: AchievementLevel.NoAchievement,
      hotStreak: AchievementLevel.NoAchievement,
      experimenterFruit: AchievementLevel.NoAchievement,
      experimenterVegetable: AchievementLevel.NoAchievement,
      experimenterLeafy: AchievementLevel.NoAchievement,
      experimenterBean: AchievementLevel.NoAchievement,
      experimenterGrain: AchievementLevel.NoAchievement,
    });
  });
});
