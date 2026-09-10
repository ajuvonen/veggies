import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {useAppStateStore} from '@/stores/appStateStore';
import {LOCALES} from '@/utils/constants';
import LocaleChanger from '@/components/LocaleChanger.vue';

describe('LocaleChanger', () => {
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    appStateStore = useAppStateStore();
  });

  it('renders', () => {
    const wrapper = mount(LocaleChanger);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows available languages', () => {
    const wrapper = mount(LocaleChanger);
    const options = wrapper.findAll('.button-like');
    expect(options).toHaveLength(LOCALES.length);
    expect(wrapper.findByText('button', 'English')).toBeDefined();
    expect(wrapper.findByText('button', 'Suomi')).toBeDefined();
    expect(wrapper.findByText('button', 'Ελληνικα')).toBeDefined();
  });

  it('changes language', async () => {
    const wrapper = mount(LocaleChanger);
    expect(appStateStore.settings.locale).toBe('en');
    await wrapper.findAll('.button-like')[1].trigger('click');
    expect(appStateStore.settings.locale).toBe('fi');
  });
});
