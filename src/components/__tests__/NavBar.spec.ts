import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import NavBar from '@/components/NavBar.vue';

describe('NavBar', () => {
  it('renders', () => {
    const wrapper = mount(NavBar, {
      props: {
        showStats: false,
      },
    });
    expect(wrapper).toBeTruthy();
  });

  it('uses showStats prop', async () => {
    const wrapper = mount(NavBar, {
      props: {
        showStats: false,
      },
    });
    expect(wrapper.find('[href="/stats"').exists()).toBe(false);
    await wrapper.setProps({showStats: true});
    expect(wrapper.find('[href="/stats"').exists()).toBe(true);
  });
});
