import {describe, it, expect, beforeEach} from 'vitest';
import {useAppStateStore} from '@/stores/appStateStore';
import {createPinia, setActivePinia} from 'pinia';

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
  });

  it('removes messages', () => {
    appStateStore.addToastMessage('hello');
    appStateStore.addToastMessage('world');
    appStateStore.removeToastMessage(appStateStore.messages[0].id);
    expect(appStateStore.messages).toHaveLength(1);
    expect(appStateStore.messages[0].text).toBe('world');
  });

  it('resets the store', () => {
    appStateStore.settings.locale = 'fi';
    appStateStore.addToastMessage('hello');
    appStateStore.$reset();
    expect(appStateStore.settings.locale).toBe('en');
    expect(appStateStore.messages).toHaveLength(0);
  });
});
