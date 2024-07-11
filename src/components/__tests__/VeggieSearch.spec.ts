import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import VeggieSearch from '@/components/VeggieSearch.vue';

describe('VeggieSearch', () => {
  it('renders', () => {
    const wrapper = mount(VeggieSearch);
    expect(wrapper).toBeTruthy();
  });

  it('filters veggies', async () => {
    const wrapper = mount(VeggieSearch);
    const input = wrapper.find('.veggie-search__input');
    await input.setValue('tomato');
    expect(wrapper.find('.veggie-search__options').isVisible()).toBe(true);
    expect(wrapper.findAll('.veggie-search__group').length).toBe(1);
    expect(wrapper.find('.veggie-search__option').text()).toContain('tomato');
  });

  it('shows all categories with matches', async () => {
    const wrapper = mount(VeggieSearch);
    const input = wrapper.find('.veggie-search__input');
    await input.setValue('ban');
    expect(wrapper.findAll('.veggie-search__option').length).toBe(2);
    expect(wrapper.findAll('.veggie-search__group').length).toBe(2);
  });

  it('displays no results', async () => {
    const wrapper = mount(VeggieSearch);
    const input = wrapper.find('.veggie-search__input');
    await input.setValue('test');
    expect(wrapper.find('.veggie-search__option').exists()).toBe(false);
    expect(wrapper.find('.veggie-search__no-results').isVisible()).toBe(true);
  });
});
