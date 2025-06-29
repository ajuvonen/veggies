import {ref} from 'vue';
import {it, describe, expect, vi, afterEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {useDropdown} from '@/hooks/dropdown';

const mocks = vi.hoisted(() => ({
  usePointer: vi.fn(),
}));

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual('@vueuse/core');
  return {
    ...actual,
    usePointer: mocks.usePointer,
  };
});

const withSetup = () =>
  new Promise<ReturnType<typeof useDropdown>>((resolve) => {
    mount({
      shallow: true,
      template: '<div />',
      setup() {
        resolve(useDropdown());
      },
    });
  });

describe('dropdown', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns correct styles', async () => {
    mocks.usePointer.mockImplementation(() => ({pointerType: ref('mouse')}));
    const {getDropdownStyles} = await withSetup();
    expect(getDropdownStyles(true, true)).toBe(
      'text-[--color-text] fill-[--color-text] bg-[--color-primary]',
    );
    expect(getDropdownStyles(true, false)).toBe(
      'text-[--color-text] fill-[--color-text] bg-[--color-primary]',
    );
    expect(getDropdownStyles(false, true)).toBe(
      'text-[--color-text-alternative] fill-[--color-text-alternative] bg-sky-200 dark:bg-sky-300',
    );
    expect(getDropdownStyles(false, false)).toBe(
      'text-[--color-text-alternative] fill-[--color-text-alternative] bg-[--color-bg-alternative]',
    );
  });

  it('returns correct styles when touch is used', async () => {
    mocks.usePointer.mockImplementation(() => ({pointerType: ref('touch')}));
    const {getDropdownStyles} = await withSetup();
    expect(getDropdownStyles(true, true)).toBe(
      'text-[--color-text-alternative] fill-[--color-text-alternative] bg-sky-200 dark:bg-sky-300',
    );
    expect(getDropdownStyles(true, false)).toBe(
      'text-[--color-text-alternative] fill-[--color-text-alternative] bg-[--color-bg-alternative]',
    );
    expect(getDropdownStyles(false, true)).toBe(
      'text-[--color-text-alternative] fill-[--color-text-alternative] bg-sky-200 dark:bg-sky-300',
    );
    expect(getDropdownStyles(false, false)).toBe(
      'text-[--color-text-alternative] fill-[--color-text-alternative] bg-[--color-bg-alternative]',
    );
  });
});
