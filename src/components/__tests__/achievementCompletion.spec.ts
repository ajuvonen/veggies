import {ref, type Ref} from 'vue';
import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import {useAchievementCompletion} from '@/hooks/achievementCompletion';

const withSetup = (veggies: Ref<string[]>) =>
  new Promise<ReturnType<typeof useAchievementCompletion>>((resolve) => {
    mount({
      shallow: true,
      template: '<div />',
      setup() {
        resolve(useAchievementCompletion(veggies));
      },
    });
  });

describe('achievementCompletion', () => {
  it('Calculates multipliers correctly', async () => {
    const veggies = ref([
      'brazil nut',
      'banana',
      'blackcurrant',
      'redcurrant',
      'blood grapefruit',
      'bell pepper',
    ]);
    const {weeklyCompletion} = await withSetup(veggies);
    expect(weeklyCompletion.value).toEqual({
      botanicalBerries: 120,
      goNuts: 72,
      lemons: 72,
      rainbow: 51,
      thirtyVeggies: 72,
    });
  });

  it('Multipliers are reactive', async () => {
    const veggies = ref(['brazil nut']);
    const {weeklyCompletion} = await withSetup(veggies);
    expect(weeklyCompletion.value).toEqual({
      botanicalBerries: 0,
      goNuts: 72,
      lemons: 0,
      rainbow: 0,
      thirtyVeggies: 12,
    });
    veggies.value = ['brazil nut', 'pistachio nut', 'peanut'];
    expect(weeklyCompletion.value).toEqual({
      botanicalBerries: 0,
      goNuts: 216,
      lemons: 0,
      rainbow: 51,
      thirtyVeggies: 36,
    });
  });
});
