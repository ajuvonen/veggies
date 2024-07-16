import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import TagsComponent from '@/components/TagsComponent.vue';

describe('ButtonComponent', () => {
  it('renders', () => {
    const wrapper = mount(TagsComponent, {
      props: {
        items: [
          {veggie: 'tomato', translation: 'Tomaatti'},
          {veggie: 'pineapple', translation: 'Ananas'},
        ],
        icon: 'plus',
      },
    });

    expect(wrapper.findByText('.button', 'Tomaatti').exists()).toBe(true);
    expect(wrapper.findByText('.button', 'Ananas').exists()).toBe(true);
  });

  it('works with variant string', () => {
    const wrapper = mount(TagsComponent, {
      props: {
        items: [
          {veggie: 'tomato', translation: 'Tomaatti'},
          {veggie: 'pineapple', translation: 'Ananas'},
        ],
        variant: 'danger',
        icon: 'minus',
      },
    });

    expect(wrapper.findByText('.button', 'Tomaatti').classes()).includes('button--danger');
    expect(wrapper.findByText('.button', 'Ananas').classes()).includes('button--danger');
  });

  it('works with variant array', () => {
    const wrapper = mount(TagsComponent, {
      props: {
        items: [
          {veggie: 'tomato', translation: 'Tomaatti'},
          {veggie: 'pineapple', translation: 'Ananas'},
        ],
        variant: ['tag', 'primary'],
        icon: 'plus',
      },
    });

    expect(wrapper.findByText('.button', 'Tomaatti').classes()).includes('button--tag');
    expect(wrapper.findByText('.button', 'Tomaatti').classes()).includes('button--primary');
    expect(wrapper.findByText('.button', 'Ananas').classes()).includes('button--tag');
    expect(wrapper.findByText('.button', 'Ananas').classes()).includes('button--primary');
  });

  it('emits click', async () => {
    const wrapper = mount(TagsComponent, {
      props: {
        items: [
          {veggie: 'tomato', translation: 'Tomaatti'},
          {veggie: 'pineapple', translation: 'Ananas'},
        ],
        variant: ['tag', 'primary'],
        icon: 'minus',
      },
    });

    await wrapper.findByText('.button', 'Tomaatti').trigger('click');
    await wrapper.findByText('.button', 'Ananas').trigger('click');
    expect(wrapper.emitted('click')).toEqual([['tomato'], ['pineapple']]);
  });
});
