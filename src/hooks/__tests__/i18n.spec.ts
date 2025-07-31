import {describe, it, expect, vi, beforeEach} from 'vitest';
import {computed, ref} from 'vue';
import {useI18nWithCollator} from '@/hooks/i18n';

const mockLocale = ref('en');

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    tm: (key: string) => [key],
    locale: computed(() => mockLocale.value),
    availableLocales: ['en', 'fi'],
  }),
}));

describe('useI18nWithCollator', () => {
  beforeEach(() => {
    mockLocale.value = 'en';
  });

  it('returns all i18n properties plus collator', () => {
    const result = useI18nWithCollator();

    expect(result.t).toBeDefined();
    expect(result.tm).toBeDefined();
    expect(result.locale).toBeDefined();
    expect(result.availableLocales).toBeDefined();
    expect(result.collator).toBeDefined();
  });

  it('creates a computed collator that reacts to locale changes', () => {
    const {collator} = useI18nWithCollator();

    expect(collator.value).toBeInstanceOf(Intl.Collator);
    expect(collator.value.resolvedOptions().locale).toBe('en');

    const initialCollator = collator.value;
    mockLocale.value = 'fi';

    expect(collator.value).toBeInstanceOf(Intl.Collator);
    expect(collator.value.resolvedOptions().locale).toBe('fi');
    expect(collator.value).not.toBe(initialCollator);
  });

  it('can sort strings using the collator', () => {
    const {collator} = useI18nWithCollator();

    const unsorted = ['zebra', 'apple', 'banana'];
    const sorted = unsorted.sort(collator.value.compare);

    expect(sorted).toEqual(['apple', 'banana', 'zebra']);
  });
});
