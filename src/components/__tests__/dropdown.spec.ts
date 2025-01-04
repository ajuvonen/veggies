import {ref} from 'vue';
import {it, describe, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import {useDropdown} from '@/hooks/dropdown';

const withSetup = () =>
  new Promise<ReturnType<typeof useDropdown>>((resolve) => {
    mount({
      shallow: true,
      template: '<div ref="elem"></div>',
      setup() {
        const elem = ref<HTMLDivElement | null>(null);
        resolve(useDropdown(elem));
      },
    });
  });

describe('dropdown', () => {
  it('returns correct styles', async () => {
    const {getDropdownStyles} = await withSetup();
    expect(getDropdownStyles(true, true)).toBe('text-slate-50 bg-sky-500');
    expect(getDropdownStyles(true, false)).toBe('text-slate-50 bg-sky-500');
    expect(getDropdownStyles(false, true)).toBe('text-slate-900 fill-slate-900 bg-sky-200');
    expect(getDropdownStyles(false, false)).toBe('text-slate-900 fill-slate-900 bg-slate-50');
  });
});
