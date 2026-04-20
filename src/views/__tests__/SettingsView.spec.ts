import {computed} from 'vue';
import {describe, it, expect, beforeEach, vi, afterEach} from 'vitest';
import {mount, flushPromises} from '@vue/test-utils';
import {DialogContent} from 'reka-ui';
import {useAppStateStore} from '@/stores/appStateStore';
import {useActivityStore} from '@/stores/activityStore';
import SettingsView from '@/views/SettingsView.vue';

const mocks = vi.hoisted(() => ({
  usePreferredReducedMotion: vi.fn(() => computed(() => 'no-preference')),
}));

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual('@vueuse/core');
  return {
    ...actual,
    usePreferredReducedMotion: mocks.usePreferredReducedMotion,
  };
});

describe('SettingsView', () => {
  let activityStore: ReturnType<typeof useActivityStore>;
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
    appStateStore = useAppStateStore();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders', () => {
    const wrapper = mount(SettingsView, {
      global: {
        stubs: {
          BuildTime: true,
        },
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('toggles animations', async () => {
    const wrapper = mount(SettingsView);
    expect(appStateStore.settings.showChartAnimations).toBe(true);
    const toggle = wrapper.findByTestId('show-animations-button');
    expect(toggle.attributes('disabled')).toBe(undefined);
    expect(toggle.attributes('data-state')).toBe('checked');
    await toggle.trigger('click');
    expect(appStateStore.settings.showChartAnimations).toBe(false);
    expect(toggle.attributes('data-state')).not.toBe('checked');
  });

  it('toggles veggie facts', async () => {
    const wrapper = mount(SettingsView);
    expect(appStateStore.settings.showVeggieFacts).toBe(true);
    const toggle = wrapper.findByTestId('show-veggie-facts-button');
    expect(toggle.attributes('data-state')).toBe('checked');
    await toggle.trigger('click');
    expect(appStateStore.settings.showVeggieFacts).toBe(false);
    expect(toggle.attributes('data-state')).not.toBe('checked');
  });

  it('toggles AI permission from false to true', async () => {
    appStateStore.settings.AIAllowed = false;
    const wrapper = mount(SettingsView);
    const toggle = wrapper.findByTestId('ai-enabled-button');
    expect(toggle.attributes('data-state')).not.toBe('checked');
    await toggle.trigger('click');
    expect(appStateStore.settings.AIAllowed).toBe(true);
    expect(toggle.attributes('data-state')).toBe('checked');
  });

  it('prevents animation toggle if all animations are disabled', () => {
    mocks.usePreferredReducedMotion.mockImplementation(() => computed(() => 'reduce'));
    const wrapper = mount(SettingsView);
    const toggle = wrapper.findByTestId('show-animations-button');
    expect(appStateStore.settings.showChartAnimations).toBe(true);
    expect(toggle.attributes('disabled')).not.toBe(undefined);
    expect(toggle.attributes('data-state')).not.toBe('checked');
  });

  it('shows allergens', () => {
    appStateStore.settings.allergens = ['peanut', 'cashew nut'];
    const wrapper = mount(SettingsView);
    expect(wrapper.findByTestId('tag-peanut').exists()).toBe(true);
    expect(wrapper.findByTestId('tag-cashew nut').exists()).toBe(true);
  });

  it('removes an allergen when its tag is clicked', async () => {
    appStateStore.settings.allergens = ['peanut', 'cashew nut'];
    const wrapper = mount(SettingsView);
    await wrapper.findByTestId('tag-peanut').find('button').trigger('click');
    expect(appStateStore.settings.allergens).toEqual(['cashew nut']);
  });

  it('resets the app', async () => {
    const wrapper = mount(SettingsView);
    await wrapper.findByTestId('reset-button').trigger('click');
    await flushPromises();
    const dialog = wrapper.getComponent(DialogContent);
    expect(dialog.isVisible()).toBe(true);
    await dialog.findByTestId('confirm-button').trigger('click');
    expect(appStateStore.$reset).toHaveBeenCalledTimes(1);
    expect(activityStore.$reset).toHaveBeenCalledTimes(1);
  });

  it('cancels reset', async () => {
    const wrapper = mount(SettingsView);
    await wrapper.findByTestId('reset-button').trigger('click');
    await flushPromises();
    const dialog = wrapper.getComponent(DialogContent);
    expect(dialog.isVisible()).toBe(true);
    await dialog.findByTestId('cancel-button').trigger('click');
    expect(appStateStore.$reset).not.toHaveBeenCalled();
    expect(activityStore.$reset).not.toHaveBeenCalled();
  });
});
