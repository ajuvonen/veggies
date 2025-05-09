import {describe, it, expect, vi, afterEach} from 'vitest';
import {mount} from '@vue/test-utils';
import NavBar from '@/components/NavBar.vue';

const mocks = vi.hoisted(() => ({
  useRoute: vi.fn(),
}));

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router');
  return {
    ...actual,
    useRoute: mocks.useRoute,
  };
});

describe('NavBar', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders for home', async () => {
    mocks.useRoute.mockImplementation(() => ({name: 'home'}));
    const wrapper = mount(NavBar, {
      props: {
        showStats: false,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders for log', () => {
    mocks.useRoute.mockImplementation(() => ({name: 'log'}));
    const wrapper = mount(NavBar, {
      props: {
        showStats: false,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders for stats', async () => {
    mocks.useRoute.mockImplementation(() => ({name: 'stats'}));
    const wrapper = mount(NavBar, {
      props: {
        showStats: false,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders for settings', async () => {
    mocks.useRoute.mockImplementation(() => ({name: 'settings'}));
    const wrapper = mount(NavBar, {
      props: {
        showStats: false,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('uses showStats prop', async () => {
    mocks.useRoute.mockImplementation(() => ({name: 'log'}));
    const wrapper = mount(NavBar, {
      props: {
        showStats: false,
      },
    });
    expect(wrapper.find('[href="/veggies/stats"').exists()).toBe(false);
    await wrapper.setProps({showStats: true});
    expect(wrapper.find('[href="/veggies/stats"').exists()).toBe(true);
  });
});
