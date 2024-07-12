import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import SettingsView from '@/views/SettingsView.vue';

describe('SettingsView', () => {
  it('renders', () => {
    const wrapper = mount(SettingsView);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
