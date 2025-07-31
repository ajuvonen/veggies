import {computed} from 'vue';
import {describe, it, expect, beforeEach, vi} from 'vitest';
import {flushPromises, mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import {useActivityStore} from '@/stores/activityStore';
import DialogStub from './DialogStub.vue';
import WeekStartDialog from '@/components/WeekStartDialog.vue';

const mounter = () =>
  mount(WeekStartDialog, {
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

describe('WeekStartDialog', () => {
  let activityStore: ReturnType<typeof useActivityStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
  });

  it('does not show dialog on initial load', async () => {
    const wrapper = mounter();
    expect(wrapper.find('#week-start-dialog').exists()).toBe(false);
  });

  it('shows dialog when currentWeekStart changes', async () => {
    // @ts-expect-error Getters are writable in tests
    activityStore.currentWeekStart = computed(() =>
      DateTime.now().startOf('week').minus({weeks: 1}),
    );
    const wrapper = mounter();

    expect(wrapper.find('#week-start-dialog').exists()).toBe(false);

    // Change to a new week
    // @ts-expect-error Getters are writable in tests
    activityStore.currentWeekStart = computed(() => DateTime.now().startOf('week'));

    await flushPromises();
    expect(wrapper.find('#week-start-dialog').exists()).toBe(true);
  });
});
