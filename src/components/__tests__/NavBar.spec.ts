import {describe, it, expect, vi, afterEach, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import NavBar from '@/components/NavBar.vue';
import {useAppStateStore} from '@/stores/appStateStore';
import {getWeekStart} from '@/utils/helpers';

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
  let appStateStore: ReturnType<typeof useAppStateStore>;
  beforeEach(() => {
    appStateStore = useAppStateStore();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders home route', async () => {
    mocks.useRoute.mockImplementation(() => ({name: 'home'}));
    const wrapper = mount(NavBar);
    expect(wrapper.findByTestId('navbar-back-link').exists()).toBe(false);
    expect(wrapper.findByTestId('navbar-stats-link').exists()).toBe(false);
    expect(wrapper.findByTestId('navbar-settings-link').exists()).toBe(false);
  });

  it('renders log route', () => {
    appStateStore.settings.startDate = getWeekStart();
    mocks.useRoute.mockImplementation(() => ({name: 'log'}));
    const wrapper = mount(NavBar);
    expect(wrapper.findByText('h1', 'Eat Your Veggies').exists()).toBe(true);
    expect(wrapper.findByTestId('navbar-back-link').exists()).toBe(false);
    expect(wrapper.findByTestId('navbar-stats-link').exists()).toBe(true);
    expect(wrapper.findByTestId('navbar-settings-link').exists()).toBe(true);
  });

  it('renders stats route', async () => {
    appStateStore.settings.startDate = getWeekStart();
    mocks.useRoute.mockImplementation(() => ({name: 'stats'}));
    const wrapper = mount(NavBar);
    expect(wrapper.findByTestId('navbar-back-link').exists()).toBe(true);
    expect(wrapper.findByTestId('navbar-stats-link').exists()).toBe(true);
    expect(wrapper.findByTestId('navbar-settings-link').exists()).toBe(true);
    expect(wrapper.findByText('h1', 'Statistics').exists()).toBe(true);
  });

  it('renders settings route', async () => {
    appStateStore.settings.startDate = getWeekStart();
    mocks.useRoute.mockImplementation(() => ({name: 'settings'}));
    const wrapper = mount(NavBar);
    expect(wrapper.findByTestId('navbar-back-link').exists()).toBe(true);
    expect(wrapper.findByTestId('navbar-stats-link').exists()).toBe(true);
    expect(wrapper.findByTestId('navbar-settings-link').exists()).toBe(true);
    expect(wrapper.findByText('h1', 'Settings').exists()).toBe(true);
  });

  it('renders privacy route', async () => {
    mocks.useRoute.mockImplementation(() => ({name: 'privacy'}));
    const wrapper = mount(NavBar);
    expect(wrapper.findByTestId('navbar-back-link').exists()).toBe(true);
    expect(wrapper.findByTestId('navbar-stats-link').exists()).toBe(false);
    expect(wrapper.findByTestId('navbar-settings-link').exists()).toBe(false);
    expect(wrapper.findByText('h1', 'Privacy').exists()).toBe(true);
  });

  it('renders privacy route with start date', async () => {
    appStateStore.settings.startDate = getWeekStart();
    mocks.useRoute.mockImplementation(() => ({name: 'privacy'}));
    const wrapper = mount(NavBar);
    expect(wrapper.findByTestId('navbar-back-link').exists()).toBe(true);
    expect(wrapper.findByTestId('navbar-stats-link').exists()).toBe(true);
    expect(wrapper.findByTestId('navbar-settings-link').exists()).toBe(true);
    expect(wrapper.findByText('h1', 'Privacy').exists()).toBe(true);
  });

  it('shows available languages', () => {
    mocks.useRoute.mockImplementation(() => ({name: 'home'}));
    const wrapper = mount(NavBar);
    const buttons = wrapper.findAll('button');
    expect(buttons).toHaveLength(1);
    expect(buttons.some((button) => button.text() === 'fi')).toBe(true);
  });

  it('changes language', async () => {
    mocks.useRoute.mockImplementation(() => ({name: 'home'}));
    const wrapper = mount(NavBar);
    expect(appStateStore.settings.locale).toBe('en');
    await wrapper.findByText('button', 'fi').trigger('click');
    expect(appStateStore.settings.locale).toBe('fi');
  });
});
