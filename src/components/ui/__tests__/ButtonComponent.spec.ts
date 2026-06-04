import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';

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

  it('works with color string', () => {
    const wrapper = mount(ButtonComponent, {
      slots: {default: 'test button'},
      props: {color: 'danger'},
    });

    expect(wrapper.find('.button-like').classes()).includes('bg-[--color-danger]');
  });

  it('creates tags', () => {
    const wrapper = mount(ButtonComponent, {
      slots: {default: 'test button'},
      props: {color: 'selected', tag: true},
    });

    expect(wrapper.find('.button-like').classes()).includes('bg-[--color-selected]');
    expect(wrapper.find('.button-like').classes()).includes('rounded-full');
    expect(wrapper.find('.button-like').classes()).includes('text-xs');
  });

  it('emits click', async () => {
    const wrapper = mount(ButtonComponent, {
      slots: {default: 'test button'},
    });

    await wrapper.find('.button-like').trigger('click');
    await wrapper.find('.button-like').trigger('click');
    await wrapper.find('.button-like').trigger('click');
    expect(wrapper.emitted('click')?.length).toBe(3);
  });
});
