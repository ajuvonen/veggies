import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import PrivacyView from '@/views/PrivacyView.vue';

describe('PrivacyView', () => {
  it('renders', () => {
    const wrapper = mount(PrivacyView);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
