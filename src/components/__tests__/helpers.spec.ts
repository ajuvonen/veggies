import {describe, it, expect} from 'vitest';
import {getCategoryForVeggie} from '@/utils/helpers';

describe('charts', () => {
  it('returns correct veggie categories', () => {
    expect(getCategoryForVeggie('onion')).toBe('root');
    expect(getCategoryForVeggie('watermelon')).toBe('fruit');
    expect(getCategoryForVeggie('tomato')).toBe('vegetable');
    expect(getCategoryForVeggie('endive')).toBe('leafy');
    expect(getCategoryForVeggie('cucumber')).toBe('vegetable');
    expect(getCategoryForVeggie('adzuki bean')).toBe('bean');
    expect(getCategoryForVeggie('rye')).toBe('grain');
  });
});
