import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import ButtonComponent from '@/components/ButtonComponent.vue';

describe('ButtonComponent', () => {
  it('renders', () => {
    const wrapper = mount(ButtonComponent, {
      slots: {default: 'test button'},
    });

    expect(wrapper.find('.button-like').text()).toBe('test button');
  });

  it('shows icon', () => {
    const wrapper = mount(ButtonComponent, {
      slots: {default: 'test button'},
      props: {icon: 'cog'},
    });

    expect(wrapper.find('.button-like').text()).toBe('test button');
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('works with variant string', () => {
    const wrapper = mount(ButtonComponent, {
      slots: {default: 'test button'},
      props: {variant: 'danger'},
    });

    expect(wrapper.find('.button-like').classes()).includes('button--danger');
  });

  it('works with variant array', () => {
    const wrapper = mount(ButtonComponent, {
      slots: {default: 'test button'},
      props: {variant: ['danger', 'tag']},
    });

    expect(wrapper.find('.button-like').classes()).includes('button--danger');
    expect(wrapper.find('.button-like').classes()).includes('button--tag');
  });

  it('emits click', async () => {
    const wrapper = mount(ButtonComponent, {
      slots: {default: 'test button'},
    });

    await wrapper.find('.button-like').trigger('click');
    expect(wrapper.emitted('click')).toEqual([[]]);
  });
});
