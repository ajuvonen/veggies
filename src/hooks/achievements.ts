import {ref} from 'vue';
import {intersection, isDeepEqual, mapValues} from 'remeda';
import {createActor, setup, type MachineContext} from 'xstate';
import type {GuardArgs} from 'xstate/guards';
import {BEANS, FRUITS, GRAINS, LEAFIES, ROOTS, VEGETABLES} from '@/utils/constants';
import type {Achievements} from '@/utils/types';

type AdvanceEvent = {
  type: 'ADVANCE';
  uniqueVeggies: string[];
  completedChallenges: number;
  hotStreakLength: number;
  totalWeeks: number;
};

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
  hotStreak:
    (threshold: number) =>
    ({event}: GuardArgs<MachineContext, AdvanceEvent>) =>
      event.hotStreakLength >= threshold,
  experimenter:
    (targetGroup: string[]) =>
    ({event}: GuardArgs<MachineContext, AdvanceEvent>) =>
      intersection(event.uniqueVeggies, targetGroup).length >= 15,
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
            target: '.challengeAccepted.0',
          },
          {
            target: `.committed.0`,
          },
          {
            target: `.completionist.0`,
          },
          {
            target: `.hotStreak.0`,
          },
          {
            target: `.experimenterFruit.0`,
          },
          {
            target: `.experimenterVegetable.0`,
          },
          {
            target: `.experimenterLeafy.0`,
          },
          {
            target: `.experimenterBean.0`,
          },
          {
            target: `.experimenterGrain.0`,
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
                ],
              },
            },
            '2': {
              on: {
                ADVANCE: {
                  target: '3',
                  guard: guards.hotStreak(20),
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
      },
    }),
  ).start();

  const achievements = ref(mapValues(actor.getSnapshot().value, Number) as Achievements);

  const subscription = actor.subscribe((snapshot) => {
    const mapped = mapValues(snapshot.value, Number);
    if (!isDeepEqual(achievements.value, mapped)) {
      achievements.value = mapped;
    }
  });

  window.addEventListener('beforeunload', () => {
    actor.stop();
    subscription.unsubscribe();
  });

  return {
    achievements,
    advanceAchievements: (
      uniqueVeggies: string[],
      hotStreakLength: number,
      totalWeeks: number,
      completedChallenges: number,
    ) =>
      actor.send({
        type: 'ADVANCE',
        uniqueVeggies,
        hotStreakLength,
        totalWeeks,
        completedChallenges,
      }),
    resetAchievements: () => actor.send({type: 'RESET'}),
  };
}
