import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';

describe('ChartScreenReaderTable', () => {
  it('mounts', () => {
    const wrapper = mount(ChartScreenReaderTable, {
      props: {
        title: 'Amount of veggies',
        columnHeaders: ['Grains', 'Vegetables', 'Roots & Bulbs'],
        data: [1, 2, 3],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.find('table').classes()).toContain('sr-only');
  });

  it('mounts with row headers', () => {
    const wrapper = mount(ChartScreenReaderTable, {
      props: {
        title: 'Amount of veggies',
        columnHeaders: ['Fruits', 'Grains', 'Leafy Greens'],
        rowHeaders: ['Week 1', 'Week 2', 'Week 3'],
        data: [
          [1, 2, 3],
          [1, 1, 2],
          [3, 3, 0],
        ],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('draws a complete table with missing data', () => {
    const wrapper = mount(ChartScreenReaderTable, {
      props: {
        title: 'Spotty data',
        columnHeaders: ['1', '2', '3'],
        data: ['A', 'B'],
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('draws a complete table with row headers and missing data', () => {
    const wrapper = mount(ChartScreenReaderTable, {
      props: {
        title: 'Spotty data',
        columnHeaders: ['1', '2', '3'],
        rowHeaders: ['A', 'B', 'C', 'D'],
        data: [['1A', '2B'], ['1A', '2B', '3C'], []],
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
