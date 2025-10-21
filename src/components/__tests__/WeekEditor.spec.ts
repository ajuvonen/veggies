import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {useActivityStore} from '@/stores/activityStore';
import WeekEditor from '@/components/WeekEditor.vue';
import {DateTime} from 'luxon';

describe('WeekEditor', () => {
  let activityStore: ReturnType<typeof useActivityStore>;
  beforeEach(() => {
    activityStore = useActivityStore();
  });

  it('renders', () => {
    const testDate = DateTime.fromFormat('30.12.2024', 'dd.MM.yyyy');
    // @ts-expect-error: getters are writable in tests
    activityStore.getWeekStarts = [testDate, testDate.minus({weeks: 1})];
    activityStore.startDate = testDate.minus({weeks: 1});
    activityStore.weeks = [
      {
        startDate: testDate,
        veggies: ['cucumber', 'tomato'],
      },
    ];
    const wrapper = mount(WeekEditor);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders without data', async () => {
    activityStore.startDate = DateTime.now().startOf('week').minus({weeks: 2});
    const wrapper = mount(WeekEditor);
    expect(wrapper.findAll('tags__container li').length).toBe(0);
    await wrapper.findByTestId('week-editor-button').trigger('click');
    expect(wrapper.findByTestId('week-editor-button').exists()).toBe(true);
    expect(wrapper.findByTestId('week-editor-option-0').exists()).toBe(true);
    expect(wrapper.findByTestId('week-editor-option-1').exists()).toBe(true);
    expect(wrapper.findByTestId('week-editor-option-2').exists()).toBe(true);
  });
});
