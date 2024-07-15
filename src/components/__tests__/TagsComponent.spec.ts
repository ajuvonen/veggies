import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import TagsComponent from '@/components/TagsComponent.vue';

describe('ButtonComponent', () => {
  it('renders', () => {
    const wrapper = mount(TagsComponent, {
      props: {
        items: ['test', 'test2'],
      },
    });

    expect(wrapper.findByText('.button', 'test').exists()).toBe(true);
    expect(wrapper.findByText('.button', 'test2').exists()).toBe(true);
  });

  it('works with variant string', () => {
    const wrapper = mount(TagsComponent, {
      props: {
        items: ['test', 'test2'],
        variant: 'danger',
      },
    });

    expect(wrapper.findByText('.button', 'test').classes()).includes('button--danger');
    expect(wrapper.findByText('.button', 'test2').classes()).includes('button--danger');
  });

  it('works with variant array', () => {
    const wrapper = mount(TagsComponent, {
      props: {
        items: ['test', 'test2'],
        variant: ['tag', 'primary'],
      },
    });

    expect(wrapper.findByText('.button', 'test').classes()).includes('button--tag');
    expect(wrapper.findByText('.button', 'test').classes()).includes('button--primary');
    expect(wrapper.findByText('.button', 'test2').classes()).includes('button--tag');
    expect(wrapper.findByText('.button', 'test2').classes()).includes('button--primary');
  });

  it('emits click', async () => {
    const wrapper = mount(TagsComponent, {
      props: {
        items: ['test', 'test2'],
        variant: ['tag', 'primary'],
      },
    });

    await wrapper.findByText('.button', 'test').trigger('click');
    await wrapper.findByText('.button', 'test2').trigger('click');
    expect(wrapper.emitted('click')).toEqual([['test'], ['test2']]);
  });
});
