import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import VeggieSearch from '@/components/VeggieSearch.vue';
import IconComponent from '@/components/IconComponent.vue';
import {KEYS} from '@/utils/constants';

const mounter = (modelValue: string[] = [], inject?: string) =>
  mount(VeggieSearch, {
    props: {
      modelValue,
    },
    global: {
      provide: {
        [KEYS.challenge]: inject,
      },
    },
  });

describe('VeggieSearch', () => {
  it('renders', () => {
    const wrapper = mounter();
    expect(wrapper).toBeTruthy();
  });

  it('filters veggies', async () => {
    const wrapper = mounter();
    const input = wrapper.findByTestId('veggie-search-input');
    await input.setValue('tomato');
    expect(wrapper.findByTestId('veggie-search-options').isVisible()).toBe(true);
    expect(wrapper.findAll('.veggie-search__heading').length).toBe(1);
    expect(wrapper.find('.dropdown-list-option').text()).toContain('tomato');
    expect(wrapper.find('#veggie-search-heading-challenge').exists()).toBe(false);
  });

  it('shows all categories with matches', async () => {
    const wrapper = mounter();
    const input = wrapper.findByTestId('veggie-search-input');
    await input.setValue('bar');
    expect(wrapper.findAll('.dropdown-list-option').length).toBe(2);
    expect(wrapper.findAll('.veggie-search__heading').length).toBe(2);
  });

  it('displays no results', async () => {
    const wrapper = mounter();
    const input = wrapper.findByTestId('veggie-search-input');
    await input.setValue('test');
    expect(wrapper.find('.dropdown-list-option').exists()).toBe(false);
    expect(wrapper.find('.veggie-search__no-results').isVisible()).toBe(true);
  });

  it('shows selection', async () => {
    const wrapper = mounter(['tomato']);
    const input = wrapper.findByTestId('veggie-search-input');
    await input.setValue('om');
    const listItem = wrapper.findByText('li', 'tomato');
    const notSelected = wrapper.findByText('li', 'pomelo');
    expect(listItem.findComponent(IconComponent).exists()).toBe(true);
    expect(notSelected.findComponent(IconComponent).exists()).toBe(false);
  });

  it('shows list on button click', async () => {
    const wrapper = mounter();
    await wrapper.findByTestId('veggie-search-button').trigger('click');
    expect(wrapper.findByTestId('veggie-search-options').isVisible()).toBe(true);
    expect(wrapper.find('#veggie-search-heading-challenge').exists()).toBe(false);
  });

  it('shows challenge if available', async () => {
    const wrapper = mounter([], 'raspberry');
    await wrapper.findByTestId('veggie-search-button').trigger('click');
    expect(wrapper.find('#veggie-search-heading-challenge').exists()).toBe(true);
  });
});
