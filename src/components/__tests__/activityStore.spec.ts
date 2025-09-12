import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import {createPinia, setActivePinia} from 'pinia';
import {take} from 'remeda';
import {AchievementLevel, Category, type Week} from '@/utils/types';
import {BEANS, FRUITS, GRAINS, LEAFIES, MUSHROOMS, ROOTS, VEGETABLES} from '@/utils/veggieDetails';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';

describe('activityStore', () => {
  const thisWeek = DateTime.now().startOf('week');
  const lastWeek = thisWeek.minus({weeks: 1});
  const twoWeeksAgo = thisWeek.minus({weeks: 2});
  const threeWeeksAgo = thisWeek.minus({weeks: 3});
  let activityStore: ReturnType<typeof useActivityStore>;
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia());
    activityStore = useActivityStore();
    appStateStore = useAppStateStore();
  });

  it('resets the date timezones', async () => {
    localStorage.setItem('veggies-start-date', '2025-01-20T00:00:00.000+14:00');
    localStorage.setItem(
      'veggies-weeks',
      JSON.stringify([{startDate: '2025-01-20T00:00:00.000+14:00', veggies: []}]),
    );
    localStorage.setItem(
      'veggies-challenges',
      JSON.stringify([{startDate: '2025-01-20T00:00:00.000-12:00', veggie: 'cucumber'}]),
    );
    const datesFromStorage = await new Promise<(DateTime | null)[]>((resolve) =>
      mount({
        template: '<div />',
        setup: () => {
          const store = useActivityStore();
          resolve([store.startDate, store.weeks[0].startDate, store.challenges[0].startDate]);
        },
      }),
    );
    datesFromStorage.forEach((date) => expect(date).toEqual(DateTime.fromISO('2025-01-20')));
  });

  it('returns current week start', () => {
    expect(activityStore.currentWeekStart).toEqual(DateTime.now().startOf('week'));
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
    activityStore.weeks = [lastWeekItem];
    activityStore.toggleVeggie('tomato');
    expect(activityStore.weeks).toHaveLength(2);
    expect(activityStore.weeks[1].veggies).toHaveLength(1);
    activityStore.toggleVeggie('tomato');
    expect(activityStore.weeks[1].veggies).toHaveLength(0);
    expect(activityStore.weeks[0]).toEqual(lastWeekItem);
  });

  it('returns all veggies', () => {
    activityStore.startDate = lastWeek;
    activityStore.weeks = [
      {
        startDate: lastWeek,
        veggies: ['eggplant', 'broccoli', 'ginger', 'apple'],
      },
      {
        startDate: thisWeek,
        veggies: ['apple', 'tomato'],
      },
    ];

    const allVeggies = activityStore.allVeggies;
    expect(allVeggies).toEqual(['eggplant', 'broccoli', 'ginger', 'apple', 'apple', 'tomato']);
  });

  it("returns this week's veggies", () => {
    activityStore.startDate = lastWeek;
    activityStore.weeks = [
      {
        startDate: lastWeek,
        veggies: ['cucumber', 'tomato'],
      },
      {
        startDate: thisWeek,
        veggies: ['cucumber', 'tomato'],
      },
    ];
    expect(activityStore.currentVeggies).toEqual(['cucumber', 'tomato']);
  });

  it('returns completed challenges', () => {
    activityStore.startDate = twoWeeksAgo;
    activityStore.weeks = [
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
    ];
    activityStore.challenges = [
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
    ];

    expect(activityStore.completedChallenges).toEqual(2);
  });

  it("sets this week's veggies", () => {
    activityStore.startDate = lastWeek;
    activityStore.weeks = [
      {
        startDate: lastWeek,
        veggies: ['cucumber', 'longan'],
      },
      {
        startDate: thisWeek,
        veggies: ['cucumber', 'tomato'],
      },
    ];
    activityStore.currentVeggies = ['banana', 'apple'];
    expect(activityStore.currentVeggies).toEqual(['banana', 'apple']);
    expect(activityStore.weeks[0].veggies).toEqual(['cucumber', 'longan']);
  });

  it("sets this week's veggies from empty", () => {
    activityStore.startDate = lastWeek;
    activityStore.weeks = [
      {
        startDate: lastWeek,
        veggies: ['cucumber', 'longan'],
      },
    ];
    activityStore.currentVeggies = ['banana', 'apple'];
    expect(activityStore.currentVeggies).toEqual(['banana', 'apple']);
    expect(activityStore.weeks[0].veggies).toEqual(['cucumber', 'longan']);
    expect(activityStore.weeks[1].startDate).toEqual(thisWeek);
  });

  it("returns specific week's veggies", () => {
    activityStore.startDate = lastWeek;
    activityStore.weeks = [
      {
        veggies: ['apple'],
        startDate: lastWeek,
      },
      {
        veggies: ['cucumber', 'tomato'],
        startDate: thisWeek,
      },
    ];

    expect(activityStore.veggiesForWeek(lastWeek)).toEqual(['apple']);
    expect(activityStore.veggiesForWeek(thisWeek)).toEqual(['cucumber', 'tomato']);
    expect(activityStore.veggiesForWeek(threeWeeksAgo)).toEqual([]);
  });

  it("returns this week's challenge", () => {
    activityStore.startDate = lastWeek;

    activityStore.challenges = [
      {
        startDate: lastWeek,
        veggie: 'cucumber',
      },
    ];

    expect(activityStore.currentChallenge).toBe(undefined);

    activityStore.challenges = [
      {
        startDate: thisWeek,
        veggie: 'tomato',
      },
    ];

    expect(activityStore.currentChallenge).toBe('tomato');
  });

  it('returns suggestions', () => {
    activityStore.startDate = threeWeeksAgo;
    activityStore.weeks = [
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
    ];

    expect(activityStore.suggestions).toEqual(['wheat', 'apple', 'cucumber']);
  });

  it('excludes this week from suggestions', () => {
    activityStore.startDate = twoWeeksAgo;
    activityStore.weeks = [
      {
        veggies: ['apple'],
        startDate: twoWeeksAgo,
      },
      {
        veggies: ['cucumber', 'wheat'],
        startDate: lastWeek,
      },
      {
        veggies: ['wheat', 'apple'],
        startDate: thisWeek,
      },
    ];

    expect(activityStore.suggestions).toEqual(['cucumber']);
  });

  it('returns correct suggestion amount', () => {
    const expected = [
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
    ];
    activityStore.startDate = twoWeeksAgo;
    activityStore.weeks = [
      {
        veggies: [...expected, 'lettuce', 'broccoli', 'lychee'],
        startDate: twoWeeksAgo,
      },
      {
        veggies: [...expected, 'lettuce', 'barley'],
        startDate: lastWeek,
      },
    ];

    expect(activityStore.suggestions).toEqual(expected);
    appStateStore.settings.suggestionCount = 5;
    expect(activityStore.suggestions).toEqual(expected.slice(0, 5));
    appStateStore.settings.suggestionCount = 0;
    expect(activityStore.suggestions).toEqual([]);
  });

  it('returns unique veggies', () => {
    activityStore.startDate = lastWeek;
    activityStore.weeks = [
      {
        veggies: ['tomato', 'apple', 'banana'],
        startDate: lastWeek,
      },
      {
        veggies: ['apple', 'tomato', 'cherry'],
        startDate: thisWeek,
      },
    ];

    expect(activityStore.uniqueVeggies).toEqual(['tomato', 'apple', 'banana', 'cherry']);
  });

  it('returns 0 as streak length', () => {
    activityStore.startDate = thisWeek;
    activityStore.weeks = [
      {
        startDate: thisWeek,
        veggies: [...Array(29)],
      },
    ];
    expect(activityStore.hotStreak).toBe(0);
  });

  it('returns 1 as streak length', () => {
    activityStore.startDate = thisWeek;
    activityStore.weeks = [
      {
        startDate: thisWeek,
        veggies: [...Array(30)],
      },
    ];
    expect(activityStore.hotStreak).toBe(1);
  });

  it('missing week ends streak', () => {
    activityStore.startDate = threeWeeksAgo;
    activityStore.weeks = [
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
    ];
    expect(activityStore.hotStreak).toBe(1);
  });

  it('missing current week does not end streak', () => {
    activityStore.startDate = twoWeeksAgo;
    activityStore.weeks = [
      {
        startDate: twoWeeksAgo,
        veggies: [...Array(30)],
      },
      {
        startDate: lastWeek,
        veggies: [...Array(30)],
      },
    ];
    expect(activityStore.hotStreak).toBe(2);
  });

  it('too few veggies ends streak', () => {
    activityStore.startDate = threeWeeksAgo;
    activityStore.weeks = [
      {
        startDate: threeWeeksAgo,
        veggies: [...Array(30)],
      },
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
    ];
    expect(activityStore.hotStreak).toBe(1);
  });

  it('returns amount of weeks with over 30 veggies', () => {
    activityStore.startDate = twoWeeksAgo;
    activityStore.weeks = [
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
    ];

    expect(activityStore.over30Veggies).toBe(2);
  });

  it('returns the amount of most veggies in a week', () => {
    activityStore.startDate = twoWeeksAgo;
    activityStore.weeks = [
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
    ];

    expect(activityStore.atMostVeggies).toBe(12);
  });

  it('returns all weekStarts from the start date', async () => {
    activityStore.startDate = thisWeek;
    expect(activityStore.getWeekStarts).toEqual([thisWeek]);
    activityStore.startDate = lastWeek;
    expect(activityStore.getWeekStarts).toEqual([thisWeek, lastWeek]);
    activityStore.startDate = thisWeek.minus({weeks: 5});
    expect(activityStore.getWeekStarts.length).toBe(6);
  });

  it('returns category favorites', () => {
    activityStore.startDate = twoWeeksAgo;
    activityStore.weeks = [
      {
        startDate: twoWeeksAgo,
        veggies: [
          ...take(FRUITS, 7),
          ...take(VEGETABLES, 7),
          ...take(LEAFIES, 7),
          ...take(ROOTS, 7),
          ...take(BEANS, 7),
          ...take(GRAINS, 7),
          ...take(MUSHROOMS, 7),
        ],
      },
      {
        startDate: lastWeek,
        veggies: [
          ...take(FRUITS, 2),
          ...take(VEGETABLES, 2),
          ...take(LEAFIES, 2),
          ...take(ROOTS, 2),
          ...take(BEANS, 2),
          ...take(GRAINS, 2),
          ...take(MUSHROOMS, 2),
        ],
      },
      {
        startDate: thisWeek,
        veggies: [
          FRUITS[0],
          VEGETABLES[0],
          LEAFIES[0],
          ROOTS[0],
          BEANS[0],
          GRAINS[0],
          MUSHROOMS[0],
        ],
      },
    ];

    expect(activityStore.favorites).toEqual({
      [Category.Fruit]: [
        [FRUITS[0], 3],
        [FRUITS[1], 2],
        [FRUITS[2], 1],
        [FRUITS[3], 1],
        [FRUITS[4], 1],
        [FRUITS[5], 1],
      ],
      [Category.Vegetable]: [
        [VEGETABLES[0], 3],
        [VEGETABLES[1], 2],
        [VEGETABLES[2], 1],
        [VEGETABLES[3], 1],
        [VEGETABLES[4], 1],
        [VEGETABLES[5], 1],
      ],
      [Category.Leafy]: [
        [LEAFIES[0], 3],
        [LEAFIES[1], 2],
        [LEAFIES[2], 1],
        [LEAFIES[3], 1],
        [LEAFIES[4], 1],
        [LEAFIES[5], 1],
      ],
      [Category.Root]: [
        [ROOTS[0], 3],
        [ROOTS[1], 2],
        [ROOTS[2], 1],
        [ROOTS[3], 1],
        [ROOTS[4], 1],
        [ROOTS[5], 1],
      ],
      [Category.Bean]: [
        [BEANS[0], 3],
        [BEANS[1], 2],
        [BEANS[2], 1],
        [BEANS[3], 1],
        [BEANS[4], 1],
        [BEANS[5], 1],
      ],
      [Category.Grain]: [
        [GRAINS[0], 3],
        [GRAINS[1], 2],
        [GRAINS[2], 1],
        [GRAINS[3], 1],
        [GRAINS[4], 1],
        [GRAINS[5], 1],
      ],
      [Category.Mushroom]: [
        [MUSHROOMS[0], 3],
        [MUSHROOMS[1], 2],
        [MUSHROOMS[2], 1],
        [MUSHROOMS[3], 1],
        [MUSHROOMS[4], 1],
        [MUSHROOMS[5], 1],
      ],
    });
  });

  it('resets the store', () => {
    activityStore.startDate = thisWeek;
    activityStore.weeks = [
      {
        startDate: thisWeek,
        veggies: [...take(VEGETABLES, 15), ...take(FRUITS, 15)],
      },
    ];
    activityStore.challenges = [
      {
        startDate: thisWeek,
        veggie: 'longan',
      },
    ];

    activityStore.$reset();

    expect(activityStore.startDate).toBe(null);
    expect(activityStore.weeks).toHaveLength(0);
    expect(activityStore.challenges).toHaveLength(0);
    expect(activityStore.achievements).toEqual({
      allOnRed: AchievementLevel.NoAchievement,
      botanicalBerries: AchievementLevel.NoAchievement,
      challengeAccepted: AchievementLevel.NoAchievement,
      committed: AchievementLevel.NoAchievement,
      completionist: AchievementLevel.NoAchievement,
      experimenterBean: AchievementLevel.NoAchievement,
      experimenterFruit: AchievementLevel.NoAchievement,
      experimenterGrain: AchievementLevel.NoAchievement,
      experimenterLeafy: AchievementLevel.NoAchievement,
      experimenterMushroom: AchievementLevel.NoAchievement,
      experimenterRoot: AchievementLevel.NoAchievement,
      experimenterVegetable: AchievementLevel.NoAchievement,
      goNuts: AchievementLevel.NoAchievement,
      hotStreak: AchievementLevel.NoAchievement,
      lemons: AchievementLevel.NoAchievement,
      overachiever: AchievementLevel.NoAchievement,
      rainbow: AchievementLevel.NoAchievement,
      thirtyVeggies: AchievementLevel.NoAchievement,
      thousandsOdd: AchievementLevel.NoAchievement,
      thousandsEven: AchievementLevel.NoAchievement,
    });
  });
});
