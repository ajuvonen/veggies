import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import MatrixScreenReaderTable from '@/components/MatrixScreenReaderTable.vue';

describe('MatrixScreenReaderTable', () => {
  it('mounts with row headers', () => {
    const wrapper = mount(MatrixScreenReaderTable, {
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

  it('draws a complete table with row headers and missing data', () => {
    const wrapper = mount(MatrixScreenReaderTable, {
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
