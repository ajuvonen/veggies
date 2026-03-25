import {describe, it, expect, beforeEach} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {useAppStateStore} from '@/stores/appStateStore';
import {DEFAULT_SETTINGS} from '@/utils/constants';

describe('appStateStore', () => {
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia());
    appStateStore = useAppStateStore();
  });

  it('adds messages', () => {
    appStateStore.addToastMessage('hello');
    expect(appStateStore.messages).toHaveLength(1);
    expect(appStateStore.messages[0].text).toBe('hello');
  });

  it('removes messages', () => {
    appStateStore.addToastMessage('hello');
    appStateStore.addToastMessage('world');
    appStateStore.removeToastMessage(appStateStore.messages[0].id);
    expect(appStateStore.messages).toHaveLength(1);
    expect(appStateStore.messages[0].text).toBe('world');
  });

  it('resets the store', () => {
    appStateStore.settings.allergens = ['peanut'];
    appStateStore.settings.locale = 'fi';
    appStateStore.settings.showChartAnimations = false;
    appStateStore.settings.showVeggieFacts = false;
    appStateStore.settings.suggestionCount = 20;
    appStateStore.addToastMessage('hello');
    appStateStore.$reset();
    expect(appStateStore.settings).toEqual(DEFAULT_SETTINGS);
    expect(appStateStore.messages).toHaveLength(0);
  });
});
