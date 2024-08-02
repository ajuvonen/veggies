import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {useActivityStore} from '@/stores/activityStore';
import HomeLocaleChanger from '@/components/HomeLocaleChanger.vue';

describe('HomeLocaleChanger', () => {
  let activityStore: ReturnType<typeof useActivityStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
  });

  it('renders', () => {
    const wrapper = mount(HomeLocaleChanger);
    expect(wrapper).toBeTruthy();
  });

  it('shows available languages', () => {
    const wrapper = mount(HomeLocaleChanger);
    const buttons = wrapper.findAll('button');
    expect(buttons).toHaveLength(1);
    expect(buttons.some((button) => button.text() === 'fi')).toBe(true);
  });

  it('changes language', async () => {
    const wrapper = mount(HomeLocaleChanger);
    expect(activityStore.settings.locale).toBe('en');
    await wrapper.findByText('button', 'fi').trigger('click');
    expect(activityStore.settings.locale).toBe('fi');
  });
});
