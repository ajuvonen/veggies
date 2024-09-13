import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import QAComponent from '@/components/QAComponent.vue';
import {nextTick} from 'vue';

describe('QAComponent', () => {
  it('renders', () => {
    const wrapper = mount(QAComponent);
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.findAll('[aria-expanded="false"]').length).toBe(7);
  });

  it('renders answers', async () => {
    const wrapper = mount(QAComponent);
    wrapper.findAll('.QA__button').forEach(async (button) => {
      await button.trigger('click');
    });
    await nextTick();
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.findAll('[aria-expanded="false"]').length).toBe(0);
  });
});
