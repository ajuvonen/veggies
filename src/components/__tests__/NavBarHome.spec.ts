import {describe, it, expect, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import NavBar from '@/components/NavBar.vue';

vi.mock('vue-router', () => ({
  useRoute: () => ({
    name: 'home',
  }),
}));

describe('NavBar Home', () => {
  it('renders for home', async () => {
    const wrapper = mount(NavBar, {
      props: {
        showStats: false,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
