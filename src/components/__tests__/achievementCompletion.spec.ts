import {ref, type MaybeRefOrGetter} from 'vue';
import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import {useAchievementCompletion} from '@/hooks/achievementCompletion';
import {ALL_VEGGIES} from '@/utils/veggieDetails';
import {take} from 'remeda';

const withSetup = (
  veggies: MaybeRefOrGetter<string[]>,
  challenge?: MaybeRefOrGetter<string | undefined>,
) =>
  new Promise<ReturnType<typeof useAchievementCompletion>>((resolve) => {
    mount({
      shallow: true,
      template: '<div />',
      setup() {
        resolve(useAchievementCompletion(veggies, challenge));
      },
    });
  });

describe('achievementCompletion', () => {
  it('Calculates multipliers correctly', async () => {
    const veggies = [
      'brazil nut',
      'banana',
      'blackcurrant',
      'redcurrant',
      'blood grapefruit',
      'bell pepper',
    ];
    const challenge = 'brazil nut'; // Challenge completed
    const {weeklyCompletion} = await withSetup(veggies, challenge);
    expect(weeklyCompletion.value).toEqual({
      allOnRed: 108,
      botanicalBerries: 120,
      goNuts: 72,
      lemons: 72,
      overachiever: 72,
      rainbow: 51,
      thirtyVeggies: 72,
    });
  });

  it('Multipliers are reactive', async () => {
    const veggies = ref(['brazil nut']);
    const challenge = ref('brazil nut');
    const {weeklyCompletion} = await withSetup(veggies, challenge);
    expect(weeklyCompletion.value).toEqual({
      allOnRed: 0,
      botanicalBerries: 0,
      goNuts: 72,
      lemons: 0,
      overachiever: 12,
      rainbow: 0,
      thirtyVeggies: 12,
    });
    veggies.value = ['brazil nut', 'pistachio nut', 'peanut'];
    expect(weeklyCompletion.value).toEqual({
      allOnRed: 0,
      botanicalBerries: 0,
      goNuts: 216,
      lemons: 0,
      overachiever: 36,
      rainbow: 51,
      thirtyVeggies: 36,
    });
  });

  it('Calculates overachiever progress correctly', async () => {
    const veggies = ref(take(ALL_VEGGIES, 35));
    const challenge = ref<string | undefined>(undefined);

    // Without challenge - should be capped at 50%
    const {weeklyCompletion} = await withSetup(veggies, challenge);
    expect(weeklyCompletion.value.overachiever).toBe(180);

    // With challenge not in veggies - should be capped at 50%
    challenge.value = ALL_VEGGIES[ALL_VEGGIES.length - 1];
    expect(weeklyCompletion.value.overachiever).toBe(180);

    // With challenge completed - should be 100%
    challenge.value = ALL_VEGGIES[0];
    veggies.value = take(ALL_VEGGIES, 30);
    expect(weeklyCompletion.value.overachiever).toBe(360);
  });
});
