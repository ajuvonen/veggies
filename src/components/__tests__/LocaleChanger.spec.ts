import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {useActivityStore} from '@/stores/activityStore';
import LocaleChanger from '@/components/LocaleChanger.vue';

describe('LocaleChanger', () => {
  let activityStore: ReturnType<typeof useActivityStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
  });

  it('renders', () => {
    const wrapper = mount(LocaleChanger);
    expect(wrapper).toBeTruthy();
  });

  it('shows available languages', () => {
    const wrapper = mount(LocaleChanger);
    const options = wrapper.findAll('.locale-changer__option');
    expect(options).toHaveLength(2);
    expect(options.some((button) => button.text() === 'English')).toBe(true);
    expect(options.some((button) => button.text() === 'Suomi')).toBe(true);
  });

  it('changes language', async () => {
    const wrapper = mount(LocaleChanger);
    expect(activityStore.settings.locale).toBe('en');
    await wrapper.findAll('.locale-changer__option')[1].trigger('click');
    expect(activityStore.settings.locale).toBe('fi');
  });
});
