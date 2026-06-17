import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import SliderComponent from '@/components/ui/SliderComponent.vue';

describe('SliderComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(SliderComponent, {
      props: {
        modelValue: 10,
        label: 'Test Slider',
        min: 0,
        max: 100,
        step: 5,
        prefix: 'slider',
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders input with correct attributes, title, and current value', () => {
    const wrapper = mount(SliderComponent, {
      props: {
        modelValue: 10,
        label: 'Test Slider',
        min: 0,
        max: 100,
        step: 5,
      },
    });
    const input = wrapper.find('input');
    expect(input.attributes('min')).toBe('0');
    expect(input.attributes('max')).toBe('100');
    expect(input.attributes('step')).toBe('5');
    expect(wrapper.find('label').text()).toBe('Test Slider');
    expect(wrapper.find('output').text()).toBe('10');
  });

  it('links label for to input id when no prefix is given', () => {
    const wrapper = mount(SliderComponent, {
      props: {
        modelValue: 10,
        label: 'Test Slider',
        min: 0,
        max: 100,
        step: 5,
      },
    });
    const inputId = wrapper.find('input').attributes('id');
    expect(inputId).toBeTruthy();
    expect(wrapper.find('label').attributes('for')).toBe(inputId);
  });

  it('updates output and emits model value when input changes', async () => {
    const wrapper = mount(SliderComponent, {
      props: {
        modelValue: 10,
        label: 'Test Slider',
        min: 0,
        max: 100,
        step: 5,
      },
    });
    await wrapper.find('input').setValue(50);
    expect(wrapper.find('output').text()).toBe('50');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([50]);
  });
});
