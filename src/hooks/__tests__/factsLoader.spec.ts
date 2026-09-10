import {describe, it, expect, vi} from 'vitest';
import {useFactsLoader} from '@/hooks/factsLoader';
import {withSetup} from '@/test-utils';
import type {Locale} from '@/types';

const mocks = vi.hoisted(() => ({
  te: vi.fn(),
  mergeLocaleMessage: vi.fn(),
}));

vi.mock('vue-i18n', async () => ({
  ...(await vi.importActual('vue-i18n')),
  useI18n: () => ({
    te: mocks.te,
    mergeLocaleMessage: mocks.mergeLocaleMessage,
  }),
}));

// Mock dynamic import of facts files
vi.mock('@/i18n/facts_en.json', () => ({
  default: {
    facts: {
      almond: ['fact 1', 'fact 2'],
      apple: ['fact 1', 'fact 2'],
    },
  },
}));

vi.mock('@/i18n/facts_fi.json', () => ({
  default: {
    facts: {
      almond: ['fakta 1', 'fakta 2'],
      apple: ['fakta 1', 'fakta 2'],
    },
  },
}));

vi.mock('@/i18n/facts_el.json', () => ({
  default: {
    facts: {
      almond: ['γεγονός 1', 'γεγονός 2'],
      apple: ['γεγονός 1', 'γεγονός 2'],
    },
  },
}));

describe('useFactsLoader', () => {
  it('does not load facts when they are already present', async () => {
    mocks.te.mockReturnValueOnce(true);

    const ensureFactsLoaded = withSetup(useFactsLoader);
    await ensureFactsLoaded('en');

    expect(mocks.te).toHaveBeenCalledWith('facts', 'en');
    expect(mocks.mergeLocaleMessage).not.toHaveBeenCalled();
  });

  it.each<[Locale, string]>([
    ['en', 'fact'],
    ['fi', 'fakta'],
    ['el', 'γεγονός'],
  ])('loads facts for locale %s', async (locale, localizedString) => {
    mocks.te.mockReturnValueOnce(false);

    const ensureFactsLoaded = withSetup(useFactsLoader);
    await ensureFactsLoaded(locale);

    expect(mocks.te).toHaveBeenCalledWith('facts', locale);
    expect(mocks.mergeLocaleMessage).toHaveBeenCalledWith(locale, {
      facts: {
        almond: [`${localizedString} 1`, `${localizedString} 2`],
        apple: [`${localizedString} 1`, `${localizedString} 2`],
      },
    });
  });

  it('can be called multiple times for same locale without reloading', async () => {
    mocks.te.mockReturnValueOnce(false).mockReturnValueOnce(true);

    const ensureFactsLoaded = withSetup(useFactsLoader);
    await ensureFactsLoaded('en');
    await ensureFactsLoaded('en');

    expect(mocks.te).toHaveBeenCalledTimes(2);
    expect(mocks.mergeLocaleMessage).toHaveBeenCalledTimes(1);
  });
});
