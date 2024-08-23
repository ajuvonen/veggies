import {computed} from 'vue';
import {intersection, mapValues} from 'remeda';
import {useMachine} from '@xstate/vue';
import {setup} from 'xstate';
import {BEANS, FRUITS, GRAINS, LEAFIES, VEGETABLES} from '@/utils/constants';
import {AchievementLevel, type Achievements} from '@/utils/types';

export function useAchievements(achievements: Achievements) {
  const achievementMachine = setup({
    types: {
      events: {} as {
        type: 'ADVANCE';
        uniqueVeggies: string[];
        hotStreakLength: number;
      },
    },
  }).createMachine({
    id: 'achievementMachine',
    type: 'parallel',
    states: {
      completionist: {
        initial: achievements.completionist.toString(),
        states: {
          [AchievementLevel.NoAchievement.toString()]: {
            on: {
              ADVANCE: {
                target: AchievementLevel.Bronze.toString(),
                guard: ({event}) => event.uniqueVeggies.length >= 40,
              },
            },
          },
          [AchievementLevel.Bronze.toString()]: {
            on: {
              ADVANCE: {
                target: AchievementLevel.Silver.toString(),
                guard: ({event}) => event.uniqueVeggies.length >= 80,
              },
            },
          },
          [AchievementLevel.Silver.toString()]: {
            on: {
              ADVANCE: {
                target: AchievementLevel.Gold.toString(),
                guard: ({event}) => event.uniqueVeggies.length >= 150,
              },
            },
          },
          [AchievementLevel.Gold.toString()]: {
            type: 'final',
          },
        },
      },
      hotStreak: {
        initial: achievements.hotStreak.toString(),
        states: {
          [AchievementLevel.NoAchievement.toString()]: {
            on: {
              ADVANCE: {
                target: AchievementLevel.Bronze.toString(),
                guard: ({event}) => event.hotStreakLength >= 5,
              },
            },
          },
          [AchievementLevel.Bronze.toString()]: {
            on: {
              ADVANCE: {
                target: AchievementLevel.Silver.toString(),
                guard: ({event}) => event.hotStreakLength >= 10,
              },
            },
          },
          [AchievementLevel.Silver.toString()]: {
            on: {
              ADVANCE: {
                target: AchievementLevel.Gold.toString(),
                guard: ({event}) => event.hotStreakLength >= 20,
              },
            },
          },
          [AchievementLevel.Gold.toString()]: {
            type: 'final',
          },
        },
      },
      experimenterFruit: {
        initial: achievements.experimenterFruit.toString(),
        states: {
          [AchievementLevel.NoAchievement.toString()]: {
            on: {
              ADVANCE: {
                target: AchievementLevel.Gold.toString(),
                guard: ({event}) => intersection(event.uniqueVeggies, FRUITS).length >= 15,
              },
            },
          },
          [AchievementLevel.Gold.toString()]: {
            type: 'final',
          },
        },
      },
      experimenterVegetable: {
        initial: achievements.experimenterVegetable.toString(),
        states: {
          [AchievementLevel.NoAchievement.toString()]: {
            on: {
              ADVANCE: {
                target: AchievementLevel.Gold.toString(),
                guard: ({event}) => intersection(event.uniqueVeggies, VEGETABLES).length >= 15,
              },
            },
          },
          [AchievementLevel.Gold.toString()]: {
            type: 'final',
          },
        },
      },
      experimenterLeafy: {
        initial: achievements.experimenterLeafy.toString(),
        states: {
          [AchievementLevel.NoAchievement.toString()]: {
            on: {
              ADVANCE: {
                target: AchievementLevel.Gold.toString(),
                guard: ({event}) => intersection(event.uniqueVeggies, LEAFIES).length >= 15,
              },
            },
          },
          [AchievementLevel.Gold.toString()]: {
            type: 'final',
          },
        },
      },
      experimenterBean: {
        initial: achievements.experimenterBean.toString(),
        states: {
          [AchievementLevel.NoAchievement.toString()]: {
            on: {
              ADVANCE: {
                target: AchievementLevel.Gold.toString(),
                guard: ({event}) => intersection(event.uniqueVeggies, BEANS).length >= 15,
              },
            },
          },
          [AchievementLevel.Gold.toString()]: {
            type: 'final',
          },
        },
      },
      experimenterGrain: {
        initial: achievements.experimenterGrain.toString(),
        states: {
          [AchievementLevel.NoAchievement.toString()]: {
            on: {
              ADVANCE: {
                target: AchievementLevel.Gold.toString(),
                guard: ({event}) => intersection(event.uniqueVeggies, GRAINS).length >= 15,
              },
            },
          },
          [AchievementLevel.Gold.toString()]: {
            type: 'final',
          },
        },
      },
    },
  });

  const {send, snapshot} = useMachine(achievementMachine);

  const achievementStatus = computed<Achievements>(() =>
    mapValues(snapshot.value.value, (stringValue) => +stringValue),
  );

  return {
    achievementStatus,
    advance: (uniqueVeggies: string[], hotStreakLength: number) =>
      send({type: 'ADVANCE', uniqueVeggies, hotStreakLength}),
  };
}
