import {computed} from 'vue';
import {describe, it, expect, beforeEach} from 'vitest';
import {flushPromises, mount} from '@vue/test-utils';
import {useActivityStore} from '@/stores/activityStore';
import {AchievementLevel} from '@/types';
import DialogStub from '@/test-utils/DialogStub.vue';
import {getAchievements} from '@/test-utils';
import AchievementDialog from '@/components/AchievementDialog.vue';

const mounter = () =>
  mount(AchievementDialog, {
    global: {
      stubs: {
        Dialog: DialogStub,
        DialogPanel: {
          template: '<div><slot /></div>',
        },
        DialogTitle: true,
      },
    },
  });

describe('AchievementDialog', () => {
  let activityStore: ReturnType<typeof useActivityStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
  });

  it('shows dialog when achievements change', async () => {
    const wrapper = mounter();

    expect(wrapper.find('#achievement-dialog').exists()).toBe(false);

    // @ts-expect-error - Getters are writable in tests
    activityStore.achievements = computed(() =>
      getAchievements({
        thirtyVeggies: AchievementLevel.Gold,
      }),
    );

    await flushPromises();
    expect(wrapper.find('#achievement-dialog').exists()).toBe(true);
  });

  it('does not show dialog if levels go down', async () => {
    // @ts-expect-error - Getters are writable in tests
    activityStore.achievements = computed(() =>
      getAchievements({
        goNuts: AchievementLevel.Gold,
        thirtyVeggies: AchievementLevel.Platinum,
      }),
    );
    const wrapper = mounter();

    expect(wrapper.find('#achievement-dialog').exists()).toBe(false);

    // @ts-expect-error - Getters are writable in tests
    activityStore.achievements = computed(() =>
      getAchievements({
        goNuts: AchievementLevel.NoAchievement,
        thirtyVeggies: AchievementLevel.Gold,
      }),
    );
    await flushPromises();
    expect(wrapper.find('#achievement-dialog').exists()).toBe(false);
  });

  it('renders all new achievements', async () => {
    // @ts-expect-error Getters are writable in tests
    activityStore.achievements = computed(() =>
      getAchievements({
        lemons: AchievementLevel.Gold,
        thirtyVeggies: AchievementLevel.Gold,
      }),
    );

    const wrapper = mounter();

    expect(wrapper.find('#achievement-dialog').exists()).toBe(false);

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
    expect(wrapper.find('#achievement-dialog').exists()).toBe(true);
    expect(wrapper.find('.badge--experimenterBean').exists()).toBe(true);
    expect(wrapper.find('.badge--goNuts').exists()).toBe(true);
    expect(wrapper.find('.badge--thirtyVeggies').exists()).toBe(true);
    expect(wrapper.find('.badge--lemons').exists()).toBe(false);
  });
});
