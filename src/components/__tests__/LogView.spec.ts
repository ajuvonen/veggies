import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import LogView from '@/views/LogView.vue';

describe('LogView', () => {
  it('renders', () => {
    const wrapper = mount(LogView);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
