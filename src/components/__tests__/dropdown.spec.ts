import {ref} from 'vue';
import {it, describe, expect, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import * as vueUse from '@vueuse/core';
import {useDropdown} from '@/hooks/dropdown';

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual('@vueuse/core');
  return {
    useMemoize: actual.useMemoize,
    usePointer: () => vi.fn(),
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
  it('returns correct styles', async () => {
    vi.spyOn(vueUse, 'usePointer').mockImplementation(
      () => ({pointerType: ref('mouse')}) as vueUse.UsePointerReturn,
    );
    const {getDropdownStyles} = await withSetup();
    expect(getDropdownStyles(true, true)).toBe('text-slate-50 bg-sky-500');
    expect(getDropdownStyles(true, false)).toBe('text-slate-50 bg-sky-500');
    expect(getDropdownStyles(false, true)).toBe('text-slate-900 fill-slate-900 bg-sky-200');
    expect(getDropdownStyles(false, false)).toBe('text-slate-900 fill-slate-900 bg-slate-50');
    vi.restoreAllMocks();
  });

  it('returns correct styles when touch is used', async () => {
    vi.spyOn(vueUse, 'usePointer').mockImplementation(
      () => ({pointerType: ref('touch')}) as vueUse.UsePointerReturn,
    );
    const {getDropdownStyles} = await withSetup();
    expect(getDropdownStyles(true, true)).toBe('text-slate-900 fill-slate-900 bg-sky-200');
    expect(getDropdownStyles(true, false)).toBe('text-slate-900 fill-slate-900 bg-slate-50');
    expect(getDropdownStyles(false, true)).toBe('text-slate-900 fill-slate-900 bg-sky-200');
    expect(getDropdownStyles(false, false)).toBe('text-slate-900 fill-slate-900 bg-slate-50');
    vi.restoreAllMocks();
  });
});
