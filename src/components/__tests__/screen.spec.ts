import {describe, it, expect, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import useScreen from '@/hooks/screen';

const withSetup = <T>(hook: () => T) =>
  new Promise<T>((resolve) => {
    mount({
      shallow: true,
      template: '<div></div>',
      setup() {
        resolve(hook());
      },
    });
  });

describe('screen hooks', () => {
  it('announces small size', async () => {
    vi.stubGlobal('innerWidth', 599);
    const {isSmallScreen} = await withSetup(useScreen);
    expect(isSmallScreen.value).toBe(true);
    vi.unstubAllGlobals();
  });

  it('announces large size', async () => {
    vi.stubGlobal('innerWidth', 600);
    const {isSmallScreen} = await withSetup(useScreen);
    expect(isSmallScreen.value).toBe(false);
    vi.unstubAllGlobals();
  });
});
