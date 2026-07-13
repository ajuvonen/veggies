import {nextTick, ref} from 'vue';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {useCssColors} from '@/hooks/cssColors';
import {withSetup} from '@/test-utils';

const mockedIsDark = ref(false);

const mocks = vi.hoisted(() => ({
  usePreferredDark: vi.fn(() => mockedIsDark),
}));

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual('@vueuse/core');
  return {...actual, usePreferredDark: mocks.usePreferredDark};
});

describe('useCssColors', () => {
  beforeEach(() => {
    mockedIsDark.value = false;
    document.documentElement.style.setProperty('--test-color-a', 'red');
    document.documentElement.style.setProperty('--test-color-b', 'green');
  });

  it('reads current variable values immediately', () => {
    const [a, b] = withSetup(useCssColors, ['--test-color-a', '--test-color-b']);
    expect(a.value).toBe('red');
    expect(b.value).toBe('green');
  });

  it('re-reads variables when dark-mode preference changes', async () => {
    const [a] = withSetup(useCssColors, ['--test-color-a']);
    document.documentElement.style.setProperty('--test-color-a', 'blue');
    mockedIsDark.value = true;
    await nextTick();
    expect(a.value).toBe('blue');
  });
});
