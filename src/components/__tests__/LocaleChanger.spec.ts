import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {useAppStateStore} from '@/stores/appStateStore';
import LocaleChanger from '@/components/LocaleChanger.vue';

describe('LocaleChanger', () => {
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    appStateStore = useAppStateStore();
  });

  it('renders', () => {
    const wrapper = mount(LocaleChanger);
    expect(wrapper).toBeTruthy();
  });

  it('shows available languages', () => {
    const wrapper = mount(LocaleChanger);
    const options = wrapper.findAll('.button-like');
    expect(options).toHaveLength(2);
    expect(options.some((button) => button.text() === 'English')).toBe(true);
    expect(options.some((button) => button.text() === 'Suomi')).toBe(true);
  });

  it('changes language', async () => {
    const wrapper = mount(LocaleChanger);
    expect(appStateStore.settings.locale).toBe('en');
    await wrapper.findAll('.button-like')[1].trigger('click');
    expect(appStateStore.settings.locale).toBe('fi');
  });
});
