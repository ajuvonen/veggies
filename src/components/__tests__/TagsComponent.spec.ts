import {describe, it, expect, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import TagsComponent from '@/components/TagsComponent.vue';

describe('TagsComponent', () => {
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
        color: 'danger',
        icon: 'minus',
        ariaTagKey: 'general.clickToRemove',
        ariaLabel: 'Suggestions',
        toggleFn: () => {},
      },
    });

    expect(wrapper.findByText('.button-like', 'tomato').classes()).includes('bg-[--color-danger]');
    expect(wrapper.findByText('.button-like', 'pineapple').classes()).includes(
      'bg-[--color-danger]',
    );
  });

  it('emits click', async () => {
    const toggleFn = vi.fn();
    const wrapper = mount(TagsComponent, {
      props: {
        veggies: ['tomato', 'pineapple'],
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
