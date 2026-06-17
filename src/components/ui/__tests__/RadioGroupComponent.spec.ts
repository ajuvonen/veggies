import {describe, it, expect} from 'vitest';
import {flushPromises, mount} from '@vue/test-utils';
import RadioGroupComponent from '@/components/ui/RadioGroupComponent.vue';

const options = [
  {value: 'a', label: 'Option A'},
  {value: 'b', label: 'Option B'},
  {value: 'c', label: 'Option C'},
];

describe('RadioGroupComponent', () => {
  it('renders correctly', async () => {
    const wrapper = mount(RadioGroupComponent, {
      props: {
        modelValue: 'a',
        options,
        label: 'Test Group',
      },
      attrs: {
        id: 'group',
      },
    });
    await flushPromises();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders one button per option with correct labels', async () => {
    const wrapper = mount(RadioGroupComponent, {
      props: {
        modelValue: 'a',
        options,
        label: 'Test Group',
      },
    });
    await flushPromises();
    const buttons = wrapper.findAll('button');
    expect(buttons).toHaveLength(3);
    buttons.forEach((button, i) => {
      expect(button.text()).toContain(options[i].label);
    });
  });

  it('links label id to group aria-labelledby when no prefix is given', async () => {
    const wrapper = mount(RadioGroupComponent, {
      props: {
        modelValue: 'a',
        options,
        label: 'Test Group',
      },
    });
    await flushPromises();
    const labelId = wrapper.find('label').attributes('id');
    expect(labelId).toBeTruthy();
    expect(wrapper.find('[role="radiogroup"]').attributes('aria-labelledby')).toBe(labelId);
  });

  it('works with number values', async () => {
    const numberOptions = [
      {value: 1, label: 'One'},
      {value: 2, label: 'Two'},
      {value: 3, label: 'Three'},
    ];
    const wrapper = mount(RadioGroupComponent, {
      props: {
        modelValue: 1,
        options: numberOptions,
        label: 'Number Group',
      },
      attrs: {
        id: 'num',
      },
    });
    await flushPromises();

    const icons = wrapper.findAllComponents({name: 'IconComponent'});
    expect(icons[0].props('icon')).toBe('radioboxMarked');
    expect(icons[1].props('icon')).toBe('radioboxBlank');

    await wrapper.findAll('button')[1].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2]);

    await wrapper.setProps({modelValue: 2});
    const updatedIcons = wrapper.findAllComponents({name: 'IconComponent'});
    expect(updatedIcons[0].props('icon')).toBe('radioboxBlank');
    expect(updatedIcons[1].props('icon')).toBe('radioboxMarked');
  });

  it('shows correct icon state and emits model update on click', async () => {
    const wrapper = mount(RadioGroupComponent, {
      props: {
        modelValue: 'a',
        options,
        label: 'Test Group',
      },
    });
    await flushPromises();

    const icons = wrapper.findAllComponents({name: 'IconComponent'});
    expect(icons[0].props('icon')).toBe('radioboxMarked');
    expect(icons[1].props('icon')).toBe('radioboxBlank');
    expect(icons[2].props('icon')).toBe('radioboxBlank');

    await wrapper.findAll('button')[2].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['c']);

    await wrapper.setProps({modelValue: 'c'});
    const updatedIcons = wrapper.findAllComponents({name: 'IconComponent'});
    expect(updatedIcons[0].props('icon')).toBe('radioboxBlank');
    expect(updatedIcons[2].props('icon')).toBe('radioboxMarked');
  });
});
