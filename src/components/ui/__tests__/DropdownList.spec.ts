import {describe, it, expect} from 'vitest';
import {flushPromises, mount} from '@vue/test-utils';
import {SelectViewport} from 'reka-ui';
import DropdownList from '@/components/ui/DropdownList.vue';

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
      slots: {
        option:
          type === 'object'
            ? '<template #option="{ item }">{{ item.name }}</template>'
            : '<template #option="{ item }">{{ item }}</template>',
      },
    });

    await flushPromises();
    const button = wrapper.findByTestId('dropdown-button');
    const viewport = wrapper.getComponent(SelectViewport);
    await button.trigger('pointerdown');

    if (type === 'object') {
      // eslint-disable-next-line vitest/no-conditional-expect
      expect(button.text()).toBe('Banana');
    } else {
      // eslint-disable-next-line vitest/no-conditional-expect
      expect(button.text()).toBe(String(options[1]));
    }
    expect(viewport.findByTestId('dropdown-option-0').isVisible()).toBe(true);
    expect(viewport.findByTestId('dropdown-option-1').isVisible()).toBe(true);
    expect(viewport.findByTestId('dropdown-option-2').isVisible()).toBe(true);

    const option1 = viewport.findByTestId('dropdown-option-1');
    expect(option1.attributes('data-state')).toBe('checked');
    expect(option1.find('svg').exists()).toBe(true);

    const option2 = viewport.findByTestId('dropdown-option-2');
    await option2.trigger('pointerup');

    const modelValueUpdates = wrapper.emitted('update:modelValue');
    expect(modelValueUpdates?.length).toBeGreaterThan(0);
    expect(modelValueUpdates?.[modelValueUpdates.length - 1]).toEqual([options[2]]);
    expect(button.text()).toBe(type === 'object' ? objectOptions[2].name : String(options[2]));
  });

  it('rotates chevron icon when dropdown opens', async () => {
    const wrapper = mount(DropdownList, {
      props: {
        modelValue: 'Apple',
        options: stringOptions,
        label: 'Select Fruit',
      },
    });

    await flushPromises();
    const chevron = wrapper.find('svg');

    expect(chevron.classes()).not.toContain('rotate-180');
    await wrapper.findByTestId('dropdown-button').trigger('pointerdown');
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

    await flushPromises();
    const viewport = wrapper.getComponent(SelectViewport);
    await wrapper.findByTestId('fruit-select-button').trigger('pointerdown');

    expect(viewport.findByTestId('fruit-select-option-0').isVisible()).toBe(true);
    expect(viewport.findByTestId('fruit-select-option-1').isVisible()).toBe(true);
    expect(viewport.findByTestId('fruit-select-option-2').isVisible()).toBe(true);
  });

  it('adds default prefix for test IDs', async () => {
    const wrapper = mount(DropdownList, {
      props: {
        modelValue: 'Apple',
        options: stringOptions,
        label: 'Select Fruit',
      },
    });

    await flushPromises();
    const viewport = wrapper.getComponent(SelectViewport);
    await wrapper.findByTestId('dropdown-button').trigger('pointerdown');

    expect(viewport.findByTestId('dropdown-option-0').isVisible()).toBe(true);
    expect(viewport.findByTestId('dropdown-option-1').isVisible()).toBe(true);
    expect(viewport.findByTestId('dropdown-option-2').isVisible()).toBe(true);
  });

  it('renders custom selected slot content', async () => {
    const wrapper = mount(DropdownList, {
      props: {
        modelValue: objectOptions[0],
        options: objectOptions,
        label: 'Select Item',
      },
      slots: {
        option:
          '<template #option="{ item }"><span class="custom-selected">Custom: {{ item.name }}</span></template>',
      },
    });
    await flushPromises();

    expect(wrapper.findByTestId('dropdown-button').text()).toBe(`Custom: ${objectOptions[0].name}`);
  });

  it('renders custom option slot', async () => {
    const wrapper = mount(DropdownList, {
      props: {
        modelValue: objectOptions[0],
        options: objectOptions,
        label: 'Select Item',
      },
      slots: {
        option:
          '<template #option="{ item }"><span class="custom-option">{{ item.name }}</span></template>',
      },
    });

    await flushPromises();
    const viewport = wrapper.getComponent(SelectViewport);
    await wrapper.findByTestId('dropdown-button').trigger('pointerdown');

    const customOptions = viewport.findAll('.custom-option').filter((option) => option.isVisible());
    expect(customOptions).toHaveLength(3);
    expect(customOptions[0].text()).toBe(objectOptions[0].name);
  });

  it('handles empty options array', async () => {
    const wrapper = mount(DropdownList, {
      props: {
        modelValue: '',
        options: [],
        label: 'Empty Dropdown',
      },
    });

    await flushPromises();
    const viewport = wrapper.getComponent(SelectViewport);
    await wrapper.findByTestId('dropdown-button').trigger('pointerdown');

    expect(viewport.findByTestId('dropdown-option-0').exists()).toBe(false);
  });

  it('handles single option', async () => {
    const wrapper = mount(DropdownList, {
      props: {
        modelValue: 'Only',
        options: ['Only'],
        label: 'Single Option',
      },
    });

    await flushPromises();
    const viewport = wrapper.getComponent(SelectViewport);
    await wrapper.findByTestId('dropdown-button').trigger('pointerdown');

    const option = viewport.findByTestId('dropdown-option-0');
    expect(option.attributes('data-state')).toBe('checked');
    expect(option.isVisible()).toBe(true);
    expect(option.text()).toBe('Only');
    expect(option.find('svg').exists()).toBe(true);
  });

  it('handles null value', async () => {
    const wrapper = mount(DropdownList, {
      props: {
        modelValue: null,
        options: ['Only'],
        label: 'Single Option',
      },
    });

    await flushPromises();
    const viewport = wrapper.getComponent(SelectViewport);
    await wrapper.findByTestId('dropdown-button').trigger('pointerdown');

    const option = viewport.findByTestId('dropdown-option-0');
    expect(option.attributes('data-state')).toBe('unchecked');
    expect(option.isVisible()).toBe(true);
    expect(option.find('svg').exists()).toBe(false);
  });
});
