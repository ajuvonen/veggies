import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import WeekStatusChart from '@/components/charts/WeekStatusChart.vue';

describe('charts', () => {
  it('prepares data for WeekStatusChart', () => {
    const wrapper = mount(WeekStatusChart, {
      shallow: true,
      props: {
        // Three roots, two vegetables, one leafy green
        currentveggies: ['onion', 'garlic', 'tomato', 'endive', 'cucumber', 'carrot'],
      },
    });
    const {
      labels,
      datasets: [{data}],
    } = wrapper.vm.chartData;
    expect(labels).toEqual(['leafy', 'vegetable', 'root']);
    expect(data).toEqual([1, 2, 3]);
  });
});
