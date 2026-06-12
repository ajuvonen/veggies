import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import SimpleScreenReaderTable from '@/components/SimpleScreenReaderTable.vue';

describe('SimpleScreenReaderTable', () => {
  it('mounts', () => {
    const wrapper = mount(SimpleScreenReaderTable, {
      props: {
        title: 'Amount of veggies',
        columnHeaders: ['Grains', 'Vegetables', 'Roots & Bulbs'],
        data: [1, 2, 3],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.find('table').classes()).toContain('sr-only');
  });

  it('draws a complete table with missing data', () => {
    const wrapper = mount(SimpleScreenReaderTable, {
      props: {
        title: 'Spotty data',
        columnHeaders: ['1', '2', '3'],
        data: ['A', 'B'],
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
