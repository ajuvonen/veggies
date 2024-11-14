import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import ContentElement from '@/components/ContentElement.vue';

describe('ContentElement', () => {
  it('renders', () => {
    const wrapper = mount(ContentElement, {
      props: {
        title: 'Test',
      },
      slots: {default: '<div>Content</div>'},
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders title as label', () => {
    const wrapper = mount(ContentElement, {
      props: {
        title: 'Test',
        labelTag: 'label',
      },
    });

    expect(wrapper.find('label').text()).toBe('Test');
  });

  it('passes attributes to label', () => {
    const wrapper = mount(ContentElement, {
      props: {
        title: 'Test',
        labelAttrs: {'aria-hidden': true},
      },
    });

    expect(wrapper.find('h2').attributes('aria-hidden')).toBe('true');
  });

  it('passes attributes to container', () => {
    const wrapper = mount(ContentElement, {
      props: {
        title: 'Test',
        containerAttrs: {
          style: 'height: 100%;',
        },
      },
    });

    expect(wrapper.find('div').attributes('style')).toEqual('height: 100%;');
  });

  it('merges classes', () => {
    const wrapper = mount(ContentElement, {
      props: {
        title: 'Test',
        labelAttrs: {
          class: 'truncate',
        },
      },
    });

    expect(wrapper.find('h2').classes()).toEqual(['label-like', 'truncate']);
  });

  it('merges classes with attribute', () => {
    const wrapper = mount(ContentElement, {
      props: {
        title: 'Test',
      },
      attrs: {
        class: 'min-h-0',
      },
    });

    expect(wrapper.find('div').classes()).toEqual(['flex-container', 'flex-col', 'min-h-0']);
  });
});
