import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import VeggieSearch from '@/components/VeggieSearch.vue';

describe('VeggieSearch', () => {
  it('renders', () => {
    const wrapper = mount(VeggieSearch);
    expect(wrapper).toBeTruthy();
  });

  it('filters ingredients', async () => {
    const wrapper = mount(VeggieSearch);
    const input = wrapper.find('.veggie-search__input');
    await input.setValue('tomato');
    expect(wrapper.find('.veggie-search__options').isVisible()).toBe(true);
    expect(wrapper.findAll('.veggie-search__group').length).toBe(1);
    expect(wrapper.find('.veggie-search__option').text()).toContain('tomato');
  });
});