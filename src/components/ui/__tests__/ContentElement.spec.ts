import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import ContentElement from '@/components/ui/ContentElement.vue';

describe('ContentElement', () => {
  it('renders', () => {
    const wrapper = mount(ContentElement, {
      props: {
        label: 'Test',
      },
      slots: {default: '<div>Content</div>'},
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders title as label', () => {
    const wrapper = mount(ContentElement, {
      props: {
        label: 'Test',
        labelTag: 'label',
      },
    });

    expect(wrapper.find('label').text()).toBe('Test');
  });

  it('passes attributes to label', () => {
    const wrapper = mount(ContentElement, {
      props: {
        label: 'Test',
        labelAttrs: {'aria-hidden': true},
      },
    });

    expect(wrapper.find('h2').attributes('aria-hidden')).toBe('true');
  });

  it('passes attributes to container', () => {
    const wrapper = mount(ContentElement, {
      props: {
        label: 'Test',
      },
      attrs: {
        style: 'height: 100%;',
      },
    });

    expect(wrapper.find('div').attributes('style')).toEqual('height: 100%;');
  });

  it('merges label classes', () => {
    const wrapper = mount(ContentElement, {
      props: {
        label: 'Test',
        labelAttrs: {
          class: 'truncate',
        },
      },
    });

    expect(wrapper.find('h2').classes()).toEqual(['label-like', 'truncate']);
  });

  it('merges container classes', () => {
    const wrapper = mount(ContentElement, {
      props: {
        label: 'Test',
      },
      attrs: {
        class: 'min-h-0',
      },
    });

    expect(wrapper.find('div').classes()).toEqual(['flex-col', 'flex-container', 'min-h-0']);
  });

  it('supports inline mode', () => {
    const wrapper = mount(ContentElement, {
      props: {
        label: 'Test',
        inline: true,
      },
      attrs: {
        class: 'min-h-0',
      },
    });

    expect(wrapper.find('div').classes()).toEqual([
      'items-center',
      'justify-between',
      'flex-container',
      'min-h-0',
    ]);
  });
});
