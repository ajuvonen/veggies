import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import {ComboboxViewport} from 'reka-ui';
import {KEYS} from '@/utils/constants';
import VeggieSearch from '@/components/VeggieSearch.vue';
import IconComponent from '@/components/ui/IconComponent.vue';

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
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('filters veggies', async () => {
    const wrapper = mounter();
    const input = wrapper.findByTestId('veggie-search-input');
    await input.setValue('tomato');
    const viewport = wrapper.getComponent(ComboboxViewport);
    expect(viewport.findByTestId('veggie-search-options').isVisible()).toBe(true);
    expect(viewport.findAll('.dropdown-list-heading').length).toBe(1);
    expect(viewport.findByText('.dropdown-list-option', 'tomato').isVisible()).toBe(true);
    expect(viewport.findByTestId('veggie-search-challenge').exists()).toBe(false);
  });

  it('shows jump controls', async () => {
    const wrapper = mounter();
    const input = wrapper.findByTestId('veggie-search-input');
    await input.setValue('');
    const viewport = wrapper.getComponent(ComboboxViewport);
    expect(viewport.findByTestId('veggie-search-options').isVisible()).toBe(true);
    expect(viewport.findByTestId('veggie-search-previous-Fruit').isVisible()).toBe(true);
    expect(viewport.findByTestId('veggie-search-next-Fruit').isVisible()).toBe(true);
    await input.setValue('a');
    expect(viewport.findByTestId('veggie-search-previous-Fruit').exists()).toBe(false);
    expect(viewport.findByTestId('veggie-search-next-Fruit').exists()).toBe(false);
  });

  it('filters veggies by synonyms', async () => {
    const wrapper = mounter();
    const input = wrapper.findByTestId('veggie-search-input');
    await input.setValue('rocket');
    const viewport = wrapper.getComponent(ComboboxViewport);
    expect(viewport.findByTestId('veggie-search-options').isVisible()).toBe(true);
    expect(viewport.findByText('.dropdown-list-option', 'arugula').isVisible()).toBe(true);
    await input.setValue('au');
    expect(viewport.findByTestId('veggie-search-options').isVisible()).toBe(true);
    expect(viewport.findByText('.dropdown-list-option', 'cauliflower').isVisible()).toBe(true);
    expect(viewport.findByText('.dropdown-list-option', 'eggplant').isVisible()).toBe(true);
  });

  it('filters veggies with accent-insensitive search', async () => {
    const wrapper = mounter();
    const input = wrapper.findByTestId('veggie-search-input');
    await input.setValue('frisee');
    const viewport = wrapper.getComponent(ComboboxViewport);
    expect(viewport.findByText('.dropdown-list-option', 'frisée').isVisible()).toBe(true);
    await input.setValue('mache');
    expect(viewport.findByText('.dropdown-list-option', 'machê').isVisible()).toBe(true);
    await input.setValue('machê');
    expect(viewport.findByText('.dropdown-list-option', 'machê').isVisible()).toBe(true);
  });

  it('shows all categories with matches', async () => {
    const wrapper = mounter();
    const input = wrapper.findByTestId('veggie-search-input');
    await input.setValue('bar');
    const viewport = wrapper.getComponent(ComboboxViewport);
    expect(viewport.findAll('.dropdown-list-option').length).toBe(2);
    expect(viewport.findAll('.dropdown-list-heading').length).toBe(2);
  });

  it('displays no results', async () => {
    const wrapper = mounter();
    const input = wrapper.findByTestId('veggie-search-input');
    await input.setValue('test');
    const viewport = wrapper.getComponent(ComboboxViewport);
    expect(viewport.find('.dropdown-list-option').exists()).toBe(false);
    expect(viewport.find('.veggie-search__no-results').isVisible()).toBe(true);
  });

  it('shows selection', async () => {
    const wrapper = mounter(['tomato']);
    const input = wrapper.findByTestId('veggie-search-input');
    await input.setValue('om');
    const viewport = wrapper.getComponent(ComboboxViewport);
    const selectedItem = viewport.findByText('.dropdown-list-option', 'tomato');
    const notSelected = viewport.findByText('.dropdown-list-option', 'pomelo');
    expect(selectedItem?.findComponent(IconComponent).exists()).toBe(true);
    expect(notSelected?.findComponent(IconComponent).exists()).toBe(false);
  });

  it('clears filter', async () => {
    const wrapper = mounter();
    const input = wrapper.findByTestId('veggie-search-input');
    await input.setValue('om');
    const clearButton = wrapper.findByTestId('veggie-search-clear-button');
    expect(clearButton.exists()).toBe(true);
    await clearButton.trigger('click');
    expect((input.element as HTMLInputElement).value).toBe('');
    const viewport = wrapper.getComponent(ComboboxViewport);
    expect(viewport.findByTestId('veggie-search-options').isVisible()).toBe(true);
  });

  it('shows list on button click', async () => {
    const wrapper = mounter();
    await wrapper.findByTestId('veggie-search-toggle-button').trigger('click');
    const viewport = wrapper.getComponent(ComboboxViewport);
    expect(viewport.findByTestId('veggie-search-options').isVisible()).toBe(true);
    expect(viewport.findByTestId('veggie-search-challenge').exists()).toBe(false);
  });

  it('shows challenge if available', async () => {
    const wrapper = mounter([], 'raspberry');
    await wrapper.findByTestId('veggie-search-toggle-button').trigger('click');
    const viewport = wrapper.getComponent(ComboboxViewport);
    expect(viewport.findByTestId('veggie-search-challenge').isVisible()).toBe(true);
  });

  it('selects from list with mouse', async () => {
    const wrapper = mounter();
    const input = wrapper.findByTestId('veggie-search-input');
    await input.setValue('tomato');
    const viewport = wrapper.getComponent(ComboboxViewport);
    const option = viewport.findByTestId('veggie-search-option-tomato');
    await option.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['tomato']]);
    await wrapper.setProps({modelValue: ['tomato']});
    await option.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([[]]);
  });

  it('selects from list with keyboard', async () => {
    const wrapper = mounter();
    const input = wrapper.findByTestId('veggie-search-input');
    await input.setValue('grapefruit');
    await input.trigger('keydown', {key: 'ArrowDown'});
    await input.trigger('keydown', {key: 'ArrowDown'});
    await input.trigger('keydown', {key: 'Enter'});
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['grapefruit']]);
    await wrapper.setProps({modelValue: ['grapefruit']});
    await input.trigger('keydown', {key: 'Enter'});
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([[]]);
  });

  it('closes list on esc key press', async () => {
    const wrapper = mounter();
    const input = wrapper.findByTestId('veggie-search-input');
    await input.trigger('focus');
    expect(
      wrapper.getComponent(ComboboxViewport).findByTestId('veggie-search-options').isVisible(),
    ).toBe(true);
    await input.trigger('keydown', {key: 'Escape'});
    expect(wrapper.findComponent(ComboboxViewport).exists()).toBe(false);
  });

  it('closes list when tabbing out of input', async () => {
    const wrapper = mounter();
    const input = wrapper.findByTestId('veggie-search-input');
    await input.trigger('focus');
    expect(
      wrapper.getComponent(ComboboxViewport).findByTestId('veggie-search-options').isVisible(),
    ).toBe(true);
    await input.trigger('blur');
    expect(wrapper.findComponent(ComboboxViewport).exists()).toBe(false);
  });

  it('keeps list open when clear button is clicked', async () => {
    const wrapper = mounter();
    const input = wrapper.findByTestId('veggie-search-input');
    await input.setValue('tom');
    const clearButton = wrapper.findByTestId('veggie-search-clear-button');
    await input.trigger('blur', {relatedTarget: clearButton.element});
    expect(
      wrapper.getComponent(ComboboxViewport).findByTestId('veggie-search-options').isVisible(),
    ).toBe(true);
    await clearButton.trigger('click');
    expect(
      wrapper.getComponent(ComboboxViewport).findByTestId('veggie-search-options').isVisible(),
    ).toBe(true);
  });

  it('keeps list open when tabbing to clear button, closes when tabbing past it', async () => {
    const wrapper = mounter();
    const input = wrapper.findByTestId('veggie-search-input');
    await input.setValue('tom');
    const clearButton = wrapper.findByTestId('veggie-search-clear-button');
    await input.trigger('blur', {relatedTarget: clearButton.element});
    expect(
      wrapper.getComponent(ComboboxViewport).findByTestId('veggie-search-options').isVisible(),
    ).toBe(true);
    await clearButton.trigger('blur');
    expect(wrapper.findComponent(ComboboxViewport).exists()).toBe(false);
  });

  it('shows placeholder', async () => {
    const wrapper = mounter();
    expect(wrapper.findByTestId('veggie-search-input').attributes('placeholder')).toBe(
      'Add Weekly Veggies',
    );
    await wrapper.setProps({placeholder: 'Add things'});
    expect(wrapper.findByTestId('veggie-search-input').attributes('placeholder')).toBe(
      'Add things',
    );
  });
});
