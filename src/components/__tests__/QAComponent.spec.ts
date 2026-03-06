import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import QAComponent from '@/components/QAComponent.vue';

describe('QAComponent', () => {
  it('renders', () => {
    const wrapper = mount(QAComponent);
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.findAll('[aria-expanded="false"]').length).toBe(8);
    expect(wrapper.findAll('.collapsible-content[data-state="closed"]').length).toBe(8);
    expect(wrapper.findAll('.collapsible-content[data-state="open"]').length).toBe(0);
  });

  it('renders answers', async () => {
    const wrapper = mount(QAComponent);
    for (const button of wrapper.findAll('button')) {
      await button.trigger('click');
    }
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.findAll('[aria-expanded="false"]').length).toBe(0);
    expect(wrapper.findAll('.collapsible-content[data-state="closed"]').length).toBe(0);
    expect(wrapper.findAll('.collapsible-content[data-state="open"]').length).toBe(8);
  });
});
