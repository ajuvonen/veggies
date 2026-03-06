import {computed} from 'vue';
import {describe, it, expect, beforeEach} from 'vitest';
import {flushPromises, mount} from '@vue/test-utils';
import {DialogContent} from 'reka-ui';
import {useActivityStore} from '@/stores/activityStore';
import {AchievementLevel} from '@/types';
import {getAchievements} from '@/test-utils';
import AchievementDialog from '@/components/AchievementDialog.vue';

describe('AchievementDialog', () => {
  let activityStore: ReturnType<typeof useActivityStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
  });

  it('shows dialog when achievements change', async () => {
    const wrapper = mount(AchievementDialog);
    await flushPromises();
    const dialog = wrapper.getComponent(DialogContent);

    expect(dialog.isVisible()).toBe(false);

    // @ts-expect-error - Getters are writable in tests
    activityStore.achievements = computed(() =>
      getAchievements({
        thirtyVeggies: AchievementLevel.Gold,
      }),
    );
    await flushPromises();

    expect(dialog.isVisible()).toBe(true);
  });

  it('does not show dialog if levels go down', async () => {
    // @ts-expect-error - Getters are writable in tests
    activityStore.achievements = computed(() =>
      getAchievements({
        goNuts: AchievementLevel.Gold,
        thirtyVeggies: AchievementLevel.Platinum,
      }),
    );
    const wrapper = mount(AchievementDialog);
    await flushPromises();
    const dialog = wrapper.getComponent(DialogContent);
    expect(dialog.isVisible()).toBe(false);

    // @ts-expect-error - Getters are writable in tests
    activityStore.achievements = computed(() =>
      getAchievements({
        goNuts: AchievementLevel.NoAchievement,
        thirtyVeggies: AchievementLevel.Gold,
      }),
    );
    await flushPromises();

    expect(dialog.isVisible()).toBe(false);
  });

  it('renders all new achievements', async () => {
    // @ts-expect-error Getters are writable in tests
    activityStore.achievements = computed(() =>
      getAchievements({
        lemons: AchievementLevel.Gold,
        thirtyVeggies: AchievementLevel.Gold,
      }),
    );

    const wrapper = mount(AchievementDialog);
    await flushPromises();
    const dialog = wrapper.getComponent(DialogContent);
    expect(dialog.isVisible()).toBe(false);

    // @ts-expect-error Getters are writable in tests
    activityStore.achievements = computed(() =>
      getAchievements({
        experimenterBean: AchievementLevel.Gold,
        lemons: AchievementLevel.NoAchievement,
        goNuts: AchievementLevel.Gold,
        thirtyVeggies: AchievementLevel.Platinum,
      }),
    );
    await flushPromises();

    expect(dialog.isVisible()).toBe(true);
    expect(dialog.find('.badge--experimenterBean').exists()).toBe(true);
    expect(dialog.find('.badge--goNuts').exists()).toBe(true);
    expect(dialog.find('.badge--thirtyVeggies').exists()).toBe(true);
    expect(dialog.find('.badge--lemons').exists()).toBe(false);
  });
});
