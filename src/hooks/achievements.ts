import {ref} from 'vue';
import {intersection, mapValues} from 'remeda';
import {createActor, setup, type MachineContext} from 'xstate';
import type {GuardArgs} from 'xstate/guards';
import {BEANS, FRUITS, GRAINS, LEAFIES, MUSHROOMS, ROOTS, VEGETABLES} from '@/utils/constants';
import type {AchievementProps, Achievements} from '@/utils/types';

type AdvanceEvent = {
  type: 'ADVANCE';
} & AchievementProps;

type ResetEvent = {
  type: 'RESET';
};

const guards = {
  challengeAccepted:
    (threshold: number) =>
    ({event}: GuardArgs<MachineContext, AdvanceEvent>) =>
      event.completedChallenges >= threshold,
  committed:
    (threshold: number) =>
    ({event}: GuardArgs<MachineContext, AdvanceEvent>) =>
      event.totalWeeks >= threshold,
  completionist:
    (threshold: number) =>
    ({event}: GuardArgs<MachineContext, AdvanceEvent>) =>
      event.uniqueVeggies.length >= threshold,
  experimenter:
    (targetGroup: string[], threshold: number = 15) =>
    ({event}: GuardArgs<MachineContext, AdvanceEvent>) =>
      intersection(event.uniqueVeggies, targetGroup).length >= threshold,
  favorite:
    (threshold: number) =>
    ({event}: GuardArgs<MachineContext, AdvanceEvent>) =>
      Object.values(event.favorites).every((favorites) => favorites[0]?.[1] >= threshold),
  hotStreak:
    (threshold: number) =>
    ({event}: GuardArgs<MachineContext, AdvanceEvent>) =>
      event.hotStreakLength >= threshold,
  thirtyVeggies:
    (threshold: number, rising: boolean) =>
    ({event}: GuardArgs<MachineContext, AdvanceEvent>) =>
      rising ? event.veggiesThisWeek >= threshold : event.veggiesThisWeek < threshold,
  thousandsOdd:
    (reverse: boolean = false) =>
    ({event}: GuardArgs<MachineContext, AdvanceEvent>) => {
      const thousands = Math.floor(event.totalVeggies / 1000);
      if (!thousands) {
        return reverse;
      }
      return (thousands % 2 === 0) === reverse;
    },
  thousandsEven:
    (reverse: boolean = false) =>
    ({event}: GuardArgs<MachineContext, AdvanceEvent>) => {
      const thousands = Math.floor(event.totalVeggies / 1000);
      if (!thousands) {
        return reverse;
      }
      return (thousands % 2 === 1) === reverse;
    },
};

export function useAchievements() {
  const actor = createActor(
    setup({
      types: {
        events: {} as AdvanceEvent | ResetEvent,
      },
    }).createMachine({
      id: 'achievementMachine',
      type: 'parallel',
      on: {
        RESET: [
          {
            target: '.',
          },
        ],
      },
      states: {
        challengeAccepted: {
          initial: '0',
          states: {
            '0': {
              on: {
                ADVANCE: [
                  {
                    target: '3',
                    guard: guards.challengeAccepted(20),
                  },
                  {
                    target: '2',
                    guard: guards.challengeAccepted(10),
                  },
                  {
                    target: '1',
                    guard: guards.challengeAccepted(5),
                  },
                ],
              },
            },
            '1': {
              on: {
                ADVANCE: [
                  {
                    target: '3',
                    guard: guards.challengeAccepted(20),
                  },
                  {
                    target: '2',
                    guard: guards.challengeAccepted(10),
                  },
                ],
              },
            },
            '2': {
              on: {
                ADVANCE: {
                  target: '3',
                  guard: guards.challengeAccepted(20),
                },
              },
            },
            '3': {},
          },
        },
        committed: {
          initial: '0',
          states: {
            '0': {
              on: {
                ADVANCE: [
                  {
                    target: '3',
                    guard: guards.committed(52),
                  },
                  {
                    target: '2',
                    guard: guards.committed(26),
                  },
                  {
                    target: '1',
                    guard: guards.committed(12),
                  },
                ],
              },
            },
            '1': {
              on: {
                ADVANCE: [
                  {
                    target: '3',
                    guard: guards.committed(52),
                  },
                  {
                    target: '2',
                    guard: guards.committed(26),
                  },
                ],
              },
            },
            '2': {
              on: {
                ADVANCE: {
                  target: '3',
                  guard: guards.committed(52),
                },
              },
            },
            '3': {},
          },
        },
        completionist: {
          initial: '0',
          states: {
            '0': {
              on: {
                ADVANCE: [
                  {
                    target: '3',
                    guard: guards.completionist(150),
                  },
                  {
                    target: '2',
                    guard: guards.completionist(80),
                  },
                  {
                    target: '1',
                    guard: guards.completionist(40),
                  },
                ],
              },
            },
            '1': {
              on: {
                ADVANCE: [
                  {
                    target: '3',
                    guard: guards.completionist(150),
                  },
                  {
                    target: '2',
                    guard: guards.completionist(80),
                  },
                ],
              },
            },
            '2': {
              on: {
                ADVANCE: {
                  target: '3',
                  guard: guards.completionist(150),
                },
              },
            },
            '3': {},
          },
        },
        experimenterBean: {
          initial: '0',
          states: {
            '0': {
              on: {
                ADVANCE: {
                  target: '3',
                  guard: guards.experimenter(BEANS),
                },
              },
            },
            '3': {},
          },
        },
        experimenterFruit: {
          initial: '0',
          states: {
            '0': {
              on: {
                ADVANCE: {
                  target: '3',
                  guard: guards.experimenter(FRUITS),
                },
              },
            },
            '3': {},
          },
        },
        experimenterGrain: {
          initial: '0',
          states: {
            '0': {
              on: {
                ADVANCE: {
                  target: '3',
                  guard: guards.experimenter(GRAINS),
                },
              },
            },
            '3': {},
          },
        },
        experimenterLeafy: {
          initial: '0',
          states: {
            '0': {
              on: {
                ADVANCE: {
                  target: '3',
                  guard: guards.experimenter(LEAFIES),
                },
              },
            },
            '3': {},
          },
        },
        experimenterMushroom: {
          initial: '0',
          states: {
            '0': {
              on: {
                ADVANCE: {
                  target: '3',
                  guard: guards.experimenter(MUSHROOMS, 10),
                },
              },
            },
            '3': {},
          },
        },
        experimenterRoot: {
          initial: '0',
          states: {
            '0': {
              on: {
                ADVANCE: {
                  target: '3',
                  guard: guards.experimenter(ROOTS),
                },
              },
            },
            '3': {},
          },
        },
        experimenterVegetable: {
          initial: '0',
          states: {
            '0': {
              on: {
                ADVANCE: {
                  target: '3',
                  guard: guards.experimenter(VEGETABLES),
                },
              },
            },
            '3': {},
          },
        },
        favorite: {
          initial: '0',
          states: {
            '0': {
              on: {
                ADVANCE: [
                  {
                    target: '3',
                    guard: guards.favorite(30),
                  },
                  {
                    target: '2',
                    guard: guards.favorite(15),
                  },
                  {
                    target: '1',
                    guard: guards.favorite(5),
                  },
                ],
              },
            },
            '1': {
              on: {
                ADVANCE: [
                  {
                    target: '3',
                    guard: guards.favorite(30),
                  },
                  {
                    target: '2',
                    guard: guards.favorite(15),
                  },
                ],
              },
            },
            '2': {
              on: {
                ADVANCE: {
                  target: '3',
                  guard: guards.favorite(30),
                },
              },
            },
            '3': {},
          },
        },
        hotStreak: {
          initial: '0',
          states: {
            '0': {
              on: {
                ADVANCE: [
                  {
                    target: '3',
                    guard: guards.hotStreak(20),
                  },
                  {
                    target: '2',
                    guard: guards.hotStreak(10),
                  },
                  {
                    target: '1',
                    guard: guards.hotStreak(5),
                  },
                ],
              },
            },
            '1': {
              on: {
                ADVANCE: [
                  {
                    target: '3',
                    guard: guards.hotStreak(20),
                  },
                  {
                    target: '2',
                    guard: guards.hotStreak(10),
                  },
                  {
                    target: '0',
                    guard: ({event}) => event.hotStreakLength === 0,
                  },
                ],
              },
            },
            '2': {
              on: {
                ADVANCE: [
                  {
                    target: '3',
                    guard: guards.hotStreak(20),
                  },
                  {
                    target: '0',
                    guard: ({event}) => event.hotStreakLength === 0,
                  },
                ],
              },
            },
            '3': {
              on: {
                ADVANCE: {
                  target: '0',
                  guard: ({event}) => event.hotStreakLength === 0,
                },
              },
            },
          },
        },
        thirtyVeggies: {
          initial: '0',
          states: {
            '0': {
              on: {
                ADVANCE: [
                  {
                    target: '4',
                    guard: guards.thirtyVeggies(40, true),
                  },
                  {
                    target: '3',
                    guard: guards.thirtyVeggies(30, true),
                  },
                ],
              },
            },
            '3': {
              on: {
                ADVANCE: [
                  {
                    target: '0',
                    guard: guards.thirtyVeggies(30, false),
                  },
                  {
                    target: '4',
                    guard: guards.thirtyVeggies(40, true),
                  },
                ],
              },
            },
            '4': {
              on: {
                ADVANCE: [
                  {
                    target: '0',
                    guard: guards.thirtyVeggies(30, false),
                  },
                  {
                    target: '3',
                    guard: guards.thirtyVeggies(40, false),
                  },
                ],
              },
            },
          },
        },
        thousandsOdd: {
          initial: '0',
          states: {
            '0': {
              on: {
                ADVANCE: [
                  {
                    target: '4',
                    guard: guards.thousandsOdd(),
                  },
                ],
              },
            },
            '4': {
              on: {
                ADVANCE: [
                  {
                    target: '0',
                    guard: guards.thousandsOdd(true),
                  },
                ],
              },
            },
          },
        },
        thousandsEven: {
          initial: '0',
          states: {
            '0': {
              on: {
                ADVANCE: [
                  {
                    target: '4',
                    guard: guards.thousandsEven(),
                  },
                ],
              },
            },
            '4': {
              on: {
                ADVANCE: [
                  {
                    target: '0',
                    guard: guards.thousandsEven(true),
                  },
                ],
              },
            },
          },
        },
      },
    }),
  ).start();

  const achievements = ref<Achievements>(mapValues(actor.getSnapshot().value, Number));

  const subscription = actor.subscribe((snapshot) => {
    achievements.value = mapValues(snapshot.value, Number);
  });

  window.addEventListener('beforeunload', () => {
    actor.stop();
    subscription.unsubscribe();
  });

  return {
    achievements,
    advanceAchievements: (achievementProps: AchievementProps) =>
      actor.send({
        type: 'ADVANCE',
        ...achievementProps,
      }),
    resetAchievements: () => actor.send({type: 'RESET'}),
  };
}
