import {describe, it, expect, vi, beforeEach} from 'vitest';
import {useFactsLoader} from '@/hooks/factsLoader';
import {withSetup} from '@/test-utils';

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

describe('useFactsLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads facts when they are not present', async () => {
    mocks.te.mockReturnValue(false);

    const ensureFactsLoaded = withSetup(useFactsLoader);
    await ensureFactsLoaded('en');

    expect(mocks.te).toHaveBeenCalledWith('facts', 'en');
    expect(mocks.mergeLocaleMessage).toHaveBeenCalledWith('en', {
      facts: {
        almond: ['fact 1', 'fact 2'],
        apple: ['fact 1', 'fact 2'],
      },
    });
  });

  it('does not load facts when they are already present', async () => {
    mocks.te.mockReturnValue(true);

    const ensureFactsLoaded = withSetup(useFactsLoader);
    await ensureFactsLoaded('en');

    expect(mocks.te).toHaveBeenCalledWith('facts', 'en');
    expect(mocks.mergeLocaleMessage).not.toHaveBeenCalled();
  });

  it('loads correct locale facts', async () => {
    mocks.te.mockReturnValue(false);

    const ensureFactsLoaded = withSetup(useFactsLoader);
    await ensureFactsLoaded('fi');

    expect(mocks.te).toHaveBeenCalledWith('facts', 'fi');
    expect(mocks.mergeLocaleMessage).toHaveBeenCalledWith('fi', {
      facts: {
        almond: ['fakta 1', 'fakta 2'],
        apple: ['fakta 1', 'fakta 2'],
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
