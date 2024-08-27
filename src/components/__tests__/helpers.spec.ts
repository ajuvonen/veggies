import {describe, it, expect} from 'vitest';
import {getCategoryForVeggie} from '@/utils/helpers';

describe('charts', () => {
  it('returns correct veggie categories', () => {
    expect(getCategoryForVeggie('onion')).toBe('Root');
    expect(getCategoryForVeggie('watermelon')).toBe('Fruit');
    expect(getCategoryForVeggie('tomato')).toBe('Vegetable');
    expect(getCategoryForVeggie('endive')).toBe('Leafy');
    expect(getCategoryForVeggie('cucumber')).toBe('Vegetable');
    expect(getCategoryForVeggie('adzuki bean')).toBe('Bean');
    expect(getCategoryForVeggie('rye')).toBe('Grain');
  });
});
