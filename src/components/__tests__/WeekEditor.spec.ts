import {describe, it, expect, beforeEach} from 'vitest';
import {flushPromises, mount} from '@vue/test-utils';
import {DateTime} from 'luxon';
import {SelectViewport} from 'reka-ui';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import WeekEditor from '@/components/WeekEditor.vue';

describe('WeekEditor', () => {
  let activityStore: ReturnType<typeof useActivityStore>;
  let appStateStore: ReturnType<typeof useAppStateStore>;
  beforeEach(() => {
    activityStore = useActivityStore();
    appStateStore = useAppStateStore();
  });

  it('renders', async () => {
    const testDate = DateTime.fromFormat('30.12.2024', 'dd.MM.yyyy');
    // @ts-expect-error: getters are writable in tests
    activityStore.getWeekStarts = [testDate, testDate.minus({weeks: 1})];
    appStateStore.settings.startDate = testDate.minus({weeks: 1});
    activityStore.weeks = [
      {
        startDate: testDate,
        veggies: ['cucumber', 'tomato'],
        challenge: 'cucumber',
      },
    ];
    const wrapper = mount(WeekEditor);
    await flushPromises();
    expect(wrapper.findByTestId('tag-cucumber').exists()).toBe(true);
    expect(wrapper.findByTestId('tag-tomato').exists()).toBe(true);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('changes week', async () => {
    const testDate = DateTime.fromFormat('30.12.2024', 'dd.MM.yyyy');
    // @ts-expect-error: getters are writable in tests
    activityStore.getWeekStarts = [testDate, testDate.minus({weeks: 1})];
    appStateStore.settings.startDate = testDate.minus({weeks: 1});
    activityStore.weeks = [
      {
        startDate: testDate,
        veggies: ['cucumber', 'tomato'],
        challenge: 'cucumber',
      },
    ];
    const wrapper = mount(WeekEditor);
    await flushPromises();
    const editorButton = wrapper.findByTestId('week-editor-button');
    const viewport = wrapper.getComponent(SelectViewport);

    expect(editorButton.text()).toBe('Week 1/2025 (30/12-05/01)');
    await editorButton.trigger('pointerdown');
    await viewport.findByTestId('week-editor-option-1').trigger('pointerup');
    expect(editorButton.text()).toBe('Week 52/2024 (23/12-29/12)');
  });

  it('renders without data', async () => {
    appStateStore.settings.startDate = DateTime.now().startOf('week').minus({weeks: 2});
    const wrapper = mount(WeekEditor);
    await flushPromises();
    const viewport = wrapper.getComponent(SelectViewport);

    await wrapper.findByTestId('week-editor-button').trigger('pointerdown');
    expect(viewport.findByTestId('week-editor-option-0').isVisible()).toBe(true);
    expect(viewport.findByTestId('week-editor-option-1').isVisible()).toBe(true);
    expect(viewport.findByTestId('week-editor-option-2').isVisible()).toBe(true);
  });
});
