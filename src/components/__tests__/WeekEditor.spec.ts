import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {useActivityStore} from '@/stores/activityStore';
import WeekEditor from '@/components/WeekEditor.vue';
import {DateTime} from 'luxon';

const thisWeek = DateTime.now().startOf('week');
const lastWeek = thisWeek.minus({weeks: 1});
const twoWeeksAgo = thisWeek.minus({weeks: 2});

describe('WeekEditor', () => {
  let activityStore: ReturnType<typeof useActivityStore>;
  beforeEach(() => {
    activityStore = useActivityStore();
  });

  it('renders', () => {
    const testDate = DateTime.fromFormat('30.12.2024', 'dd.MM.yyyy');
    activityStore.startDate = testDate;
    activityStore.weeks.push({
      startDate: testDate,
      veggies: ['cucumber', 'tomato'],
    });
    const wrapper = mount(WeekEditor);
    expect(wrapper.findByTestId('veggie-search-input').exists()).toBe(false);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders without data', async () => {
    activityStore.startDate = twoWeeksAgo;
    const wrapper = mount(WeekEditor);
    expect(wrapper.findByTestId('veggie-search-input').exists()).toBe(false);
    await wrapper.findByTestId('week-editor-dropdown-button').trigger('click');
    expect(wrapper.findByTestId('week-editor-dropdown-button').exists()).toBe(true);
    expect(wrapper.findByTestId('week-editor-option-0').exists()).toBe(true);
    expect(wrapper.findByTestId('week-editor-option-1').exists()).toBe(true);
    expect(wrapper.findByTestId('week-editor-option-2').exists()).toBe(true);
  });

  it('renders past week', async () => {
    activityStore.startDate = lastWeek;
    activityStore.weeks.push({
      startDate: lastWeek,
      veggies: ['longan', 'rambutan'],
    });
    const wrapper = mount(WeekEditor);
    await wrapper.findByTestId('week-editor-dropdown-button').trigger('click');
    await wrapper.findByTestId('week-editor-option-1').trigger('click');
    expect(wrapper.findByTestId('veggie-search-input').exists()).toBe(true);
    expect(wrapper.findByTestId('tag-longan').exists()).toBe(true);
    expect(wrapper.findByTestId('tag-rambutan').exists()).toBe(true);
  });
});
