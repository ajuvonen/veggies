import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import TagsComponent from '@/components/TagsComponent.vue';

describe('ButtonComponent', () => {
  it('renders', () => {
    const wrapper = mount(TagsComponent, {
      props: {
        veggies: ['tomato', 'pineapple'],
        icon: 'plus',
        ariaKey: 'general.clickToAdd',
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
        ariaKey: 'general.clickToRemove',
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
        ariaKey: 'general.clickToAdd',
      },
    });

    expect(wrapper.findByText('.button-like', 'tomato').classes()).includes('button--tag');
    expect(wrapper.findByText('.button-like', 'tomato').classes()).includes('button--primary');
    expect(wrapper.findByText('.button-like', 'pineapple').classes()).includes('button--tag');
    expect(wrapper.findByText('.button-like', 'pineapple').classes()).includes('button--primary');
  });

  it('emits click', async () => {
    const wrapper = mount(TagsComponent, {
      props: {
        veggies: ['tomato', 'pineapple'],
        variant: ['tag', 'primary'],
        icon: 'minus',
        ariaKey: 'general.clickToRemove',
      },
    });

    await wrapper.findByText('.button-like', 'tomato').trigger('click');
    await wrapper.findByText('.button-like', 'pineapple').trigger('click');
    expect(wrapper.emitted('toggle')).toEqual([['tomato'], ['pineapple']]);
  });
});
