import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import ToggleComponent from '@/components/ui/ToggleComponent.vue';

describe('ToggleComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(ToggleComponent, {
      props: {
        modelValue: false,
        disabled: false,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('changes model value when toggle button is clicked', async () => {
    const wrapper = mount(ToggleComponent, {
      props: {
        modelValue: false,
        disabled: false,
      },
    });

    // Click the toggle button (Switch component)
    await wrapper.find('button').trigger('click');
    await wrapper.find('button').trigger('click');

    // Check that the update:modelValue event was emitted with the new value
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([false]);
  });

  it('is disabled when disabled prop is true', async () => {
    const wrapper = mount(ToggleComponent, {
      props: {
        modelValue: false,
        disabled: true,
      },
    });

    const toggleButton = wrapper.find('button');
    await wrapper.find('button').trigger('click');

    expect(toggleButton.attributes('disabled')).toBeDefined();
    expect(wrapper.emitted('update:modelValue')).toBeFalsy();
  });

  it('shows correct icon based on model value', async () => {
    const wrapper = mount(ToggleComponent, {
      props: {
        modelValue: false,
      },
    });

    expect(wrapper.findComponent({name: 'IconComponent'}).props('icon')).toBe('close');
    await wrapper.setProps({modelValue: true});
    expect(wrapper.findComponent({name: 'IconComponent'}).props('icon')).toBe('check');
  });
});
