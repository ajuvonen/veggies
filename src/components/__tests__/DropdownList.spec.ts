import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import DropdownList from '@/components/DropdownList.vue';

const stringOptions = ['Apple', 'Banana', 'Cherry'];
const numberOptions = [1, 2, 3];
const objectOptions = [
  {id: 1, name: 'Apple'},
  {id: 2, name: 'Banana'},
  {id: 3, name: 'Cherry'},
];

describe('DropdownList', () => {
  it.each([
    ['string', stringOptions],
    ['number', numberOptions],
    ['object', objectOptions],
  ])('works with %s options', async (type, options) => {
    const wrapper = mount(DropdownList, {
      props: {
        modelValue: options[1],
        options,
        label: 'Select Item',
      },
    });

    // Check selected value is displayed
    const button = wrapper.findByTestId('dropdown-button');
    if (type === 'object') {
      // eslint-disable-next-line vitest/no-conditional-expect
      expect(button.text()).toContain('Banana');
    } else {
      // eslint-disable-next-line vitest/no-conditional-expect
      expect(button.text()).toBe(String(options[1]));
    }

    // Open dropdown
    await button.trigger('click');

    // Check all options are rendered
    const optionElements = wrapper.findAll('li');
    expect(optionElements).toHaveLength(3);

    // Check selected item has check icon
    const checkIcon = optionElements[1].find('svg');
    expect(checkIcon.exists()).toBe(true);

    // Click another option and check emitted value
    await optionElements[2].trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([options[2]]);
  });

  it('rotates chevron icon when dropdown opens', async () => {
    const wrapper = mount(DropdownList, {
      props: {
        modelValue: 'Apple',
        options: stringOptions,
        label: 'Select Fruit',
      },
    });

    const chevron = wrapper.find('svg');
    const button = wrapper.findByTestId('dropdown-button');

    expect(chevron.classes()).not.toContain('rotate-180');
    await button.trigger('click');
    expect(chevron.classes()).toContain('rotate-180');
  });

  it('uses custom prefix for test IDs', async () => {
    const wrapper = mount(DropdownList, {
      props: {
        modelValue: 'Apple',
        options: stringOptions,
        label: 'Select Fruit',
        prefix: 'fruit-select',
      },
    });

    expect(wrapper.findByTestId('fruit-select-button').exists()).toBe(true);
    await wrapper.findByTestId('fruit-select-button').trigger('click');

    expect(wrapper.findByTestId('fruit-select-option-0').exists()).toBe(true);
    expect(wrapper.findByTestId('fruit-select-option-1').exists()).toBe(true);
    expect(wrapper.findByTestId('fruit-select-option-2').exists()).toBe(true);
  });

  it('adds default prefix for test IDs', async () => {
    const wrapper = mount(DropdownList, {
      props: {
        modelValue: 'Apple',
        options: stringOptions,
        label: 'Select Fruit',
      },
    });

    expect(wrapper.findByTestId('dropdown-button').exists()).toBe(true);
    await wrapper.findByTestId('dropdown-button').trigger('click');

    expect(wrapper.findByTestId('dropdown-option-0').exists()).toBe(true);
    expect(wrapper.findByTestId('dropdown-option-1').exists()).toBe(true);
    expect(wrapper.findByTestId('dropdown-option-2').exists()).toBe(true);
  });

  it('renders custom selected slot content', () => {
    const wrapper = mount(DropdownList, {
      props: {
        modelValue: objectOptions[0],
        options: objectOptions,
        label: 'Select Item',
      },
      slots: {
        selected: '<span class="custom-selected">Custom: {{ item.name }}</span>',
      },
    });

    expect(wrapper.find('.custom-selected').exists()).toBe(true);
    expect(wrapper.find('.custom-selected').text()).toContain('Custom:');
  });

  it('renders custom option slot', async () => {
    const wrapper = mount(DropdownList, {
      props: {
        modelValue: objectOptions[0],
        options: objectOptions,
        label: 'Select Item',
      },
      slots: {
        option: '<span class="custom-option">{{ item.name }}</span>',
      },
    });

    await wrapper.findByTestId('dropdown-button').trigger('click');

    const customOptions = wrapper.findAll('.custom-option');
    expect(customOptions).toHaveLength(3);
    expect(customOptions[0].text()).toBe('Apple');
  });

  it('handles empty options array', () => {
    const wrapper = mount(DropdownList, {
      props: {
        modelValue: '',
        options: [],
        label: 'Empty Dropdown',
      },
    });

    expect(wrapper.findByTestId('dropdown-button').exists()).toBe(true);
  });

  it('handles single option', async () => {
    const wrapper = mount(DropdownList, {
      props: {
        modelValue: 'Only',
        options: ['Only'],
        label: 'Single Option',
      },
    });

    await wrapper.findByTestId('dropdown-button').trigger('click');

    const options = wrapper.findAll('li');
    expect(options).toHaveLength(1);
    expect(options[0].text()).toContain('Only');
  });

  it('handles null value', async () => {
    const wrapper = mount(DropdownList, {
      props: {
        modelValue: null,
        options: ['Only'],
        label: 'Single Option',
      },
    });

    await wrapper.findByTestId('dropdown-button').trigger('click');

    const options = wrapper.findAll('li');
    expect(options).toHaveLength(1);
    const checkIcon = options[0].find('svg');
    expect(checkIcon.exists()).toBe(false);
  });
});
