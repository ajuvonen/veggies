import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import DropdownList from '@/components/DropdownList.vue';

const stringOptions = ['Apple', 'Banana', 'Cherry'];
const objectOptions = [
  {id: 1, name: 'Apple'},
  {id: 2, name: 'Banana'},
  {id: 3, name: 'Cherry'},
];

describe('DropdownList', () => {
  it('renders with string options', () => {
    const wrapper = mount(DropdownList, {
      props: {
        modelValue: 'Apple',
        options: stringOptions,
        label: 'Select Fruit',
      },
    });

    expect(wrapper.findByTestId('dropdown-button').text()).toContain('Apple');
    expect(wrapper.find('label').text()).toContain('Select Fruit');
  });

  it('renders with object options using custom keyFn', async () => {
    const wrapper = mount(DropdownList, {
      props: {
        modelValue: objectOptions[2],
        options: objectOptions,
        label: 'Select Item',
        keyFn: (item) => (item as {id: number}).id,
      },
    });

    const button = wrapper.findByTestId('dropdown-button');
    expect(button.text()).toContain('Cherry');
    expect(wrapper.find('label').text()).toContain('Select Item');

    await button.trigger('click');
    const options = wrapper.findAll('li');
    expect(options).toHaveLength(3);
    expect(options[0].text()).toContain('Apple');
    expect(options[1].text()).toContain('Banana');
    expect(options[2].text()).toContain('Cherry');
  });

  it('displays the selected value', () => {
    const wrapper = mount(DropdownList, {
      props: {
        modelValue: 'Banana',
        options: stringOptions,
        label: 'Select Fruit',
      },
    });

    expect(wrapper.findByTestId('dropdown-button').text()).toContain('Banana');
  });

  it('open dropdown looks as it should', async () => {
    const wrapper = mount(DropdownList, {
      props: {
        modelValue: 'Apple',
        options: stringOptions,
        label: 'Select Fruit',
      },
    });

    const chevron = wrapper.find('svg');
    const button = wrapper.findByTestId('dropdown-button');

    expect(chevron.exists()).toBe(true);
    expect(chevron.classes()).not.toContain('rotate-180');

    await button.trigger('click');
    expect(chevron.classes()).toContain('rotate-180');

    const options = wrapper.findAll('li');
    const selectedOption = options[0];
    const checkIcon = selectedOption.find('svg');

    expect(options.length).toBe(3);
    expect(checkIcon.exists()).toBe(true);
    expect(options[0].text()).toContain('Apple');
    expect(options[1].text()).toContain('Banana');
    expect(options[2].text()).toContain('Cherry');
  });

  it('emits update:modelValue when option is selected', async () => {
    const wrapper = mount(DropdownList, {
      props: {
        modelValue: 'Apple',
        options: stringOptions,
        label: 'Select Fruit',
      },
    });

    await wrapper.findByTestId('dropdown-button').trigger('click');
    const options = wrapper.findAll('li');
    await options[1].trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['Banana']);
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

  it('handles object options without keyFn', async () => {
    const simpleObjects = [{value: 1}, {value: 2}];

    const wrapper = mount(DropdownList, {
      props: {
        modelValue: simpleObjects[0],
        options: simpleObjects,
        label: 'Objects',
      },
    });

    await wrapper.findByTestId('dropdown-button').trigger('click');

    const options = wrapper.findAll('li');
    expect(options).toHaveLength(2);
  });

  it('works with number options', async () => {
    const numbers = [1, 2, 3, 4, 5];

    const wrapper = mount(DropdownList, {
      props: {
        modelValue: 1,
        options: numbers,
        label: 'Select Number',
      },
    });

    await wrapper.findByTestId('dropdown-button').trigger('click');

    const options = wrapper.findAll('li');
    expect(options).toHaveLength(5);

    await options[2].trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([3]);
  });

  it('works with complex nested objects', async () => {
    const complexObjects = [
      {id: 1, data: {nested: {value: 'A'}}, meta: {count: 10}},
      {id: 2, data: {nested: {value: 'B'}}, meta: {count: 20}},
    ];

    const wrapper = mount(DropdownList, {
      props: {
        modelValue: complexObjects[0],
        options: complexObjects,
        label: 'Complex Objects',
        keyFn: (item) => (item as {id: number}).id,
      },
    });

    await wrapper.findByTestId('dropdown-button').trigger('click');

    const options = wrapper.findAll('li');
    expect(options).toHaveLength(2);

    await options[1].trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([complexObjects[1]]);
  });
});
