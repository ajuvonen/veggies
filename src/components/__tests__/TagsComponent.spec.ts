import {describe, it, expect, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import TagsComponent from '@/components/TagsComponent.vue';

describe('ButtonComponent', () => {
  it('renders', () => {
    const wrapper = mount(TagsComponent, {
      props: {
        veggies: ['tomato', 'pineapple'],
        icon: 'plus',
        ariaTagKey: 'general.clickToAdd',
        ariaLabel: 'Suggestions',
        toggleFn: () => {},
      },
    });

    expect(wrapper.findByText('.button-like', 'tomato').exists()).toBe(true);
    expect(wrapper.findByText('.button-like', 'pineapple').exists()).toBe(true);
  });

  it('works with variant string', () => {
    const wrapper = mount(TagsComponent, {
      props: {
        veggies: ['tomato', 'pineapple'],
        variant: 'danger',
        icon: 'minus',
        ariaTagKey: 'general.clickToRemove',
        ariaLabel: 'Suggestions',
        toggleFn: () => {},
      },
    });

    expect(wrapper.findByText('.button-like', 'tomato').classes()).includes('button--danger');
    expect(wrapper.findByText('.button-like', 'pineapple').classes()).includes('button--danger');
  });

  it('works with variant array', () => {
    const wrapper = mount(TagsComponent, {
      props: {
        veggies: ['tomato', 'pineapple'],
        variant: ['tag', 'primary'],
        icon: 'plus',
        ariaTagKey: 'general.clickToAdd',
        ariaLabel: 'Suggestions',
        toggleFn: () => {},
      },
    });

    expect(wrapper.findByText('.button-like', 'tomato').classes()).includes('button--tag');
    expect(wrapper.findByText('.button-like', 'tomato').classes()).includes('button--primary');
    expect(wrapper.findByText('.button-like', 'pineapple').classes()).includes('button--tag');
    expect(wrapper.findByText('.button-like', 'pineapple').classes()).includes('button--primary');
  });

  it('emits click', async () => {
    const toggleFn = vi.fn();
    const wrapper = mount(TagsComponent, {
      props: {
        veggies: ['tomato', 'pineapple'],
        variant: ['tag', 'primary'],
        icon: 'minus',
        ariaTagKey: 'general.clickToRemove',
        ariaLabel: 'Suggestions',
        toggleFn,
      },
    });

    await wrapper.findByText('.button-like', 'tomato').trigger('click');
    await wrapper.findByText('.button-like', 'pineapple').trigger('click');
    expect(toggleFn).toBeCalledTimes(2);
    expect(toggleFn).toBeCalledWith('tomato');
    expect(toggleFn).toBeCalledWith('pineapple');
  });
});
