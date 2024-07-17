import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import TagsComponent from '@/components/TagsComponent.vue';

describe('ButtonComponent', () => {
  it('renders', () => {
    const wrapper = mount(TagsComponent, {
      props: {
        veggies: ['tomato', 'pineapple'],
        icon: 'plus',
      },
    });

    expect(wrapper.findByText('.button', 'tomato').exists()).toBe(true);
    expect(wrapper.findByText('.button', 'pineapple').exists()).toBe(true);
  });

  it('works with variant string', () => {
    const wrapper = mount(TagsComponent, {
      props: {
        veggies: ['tomato', 'pineapple'],
        variant: 'danger',
        icon: 'minus',
      },
    });

    expect(wrapper.findByText('.button', 'tomato').classes()).includes('button--danger');
    expect(wrapper.findByText('.button', 'pineapple').classes()).includes('button--danger');
  });

  it('works with variant array', () => {
    const wrapper = mount(TagsComponent, {
      props: {
        veggies: ['tomato', 'pineapple'],
        variant: ['tag', 'primary'],
        icon: 'plus',
      },
    });

    expect(wrapper.findByText('.button', 'tomato').classes()).includes('button--tag');
    expect(wrapper.findByText('.button', 'tomato').classes()).includes('button--primary');
    expect(wrapper.findByText('.button', 'pineapple').classes()).includes('button--tag');
    expect(wrapper.findByText('.button', 'pineapple').classes()).includes('button--primary');
  });

  it('emits click', async () => {
    const wrapper = mount(TagsComponent, {
      props: {
        veggies: ['tomato', 'pineapple'],
        variant: ['tag', 'primary'],
        icon: 'minus',
      },
    });

    await wrapper.findByText('.button', 'tomato').trigger('click');
    await wrapper.findByText('.button', 'pineapple').trigger('click');
    expect(wrapper.emitted('click')).toEqual([['tomato'], ['pineapple']]);
  });
});
