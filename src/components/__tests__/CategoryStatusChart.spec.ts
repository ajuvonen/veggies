import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import CategoryStatusChart from '@/components/charts/CategoryStatusChart.vue';

describe('CategoryStatusChart', () => {
  it('renders', () => {
    const wrapper = mount(CategoryStatusChart, {
      props: {
        veggies: ['carrot', 'onion', 'ginger'],
      },
      global: {
        stubs: {
          'i18n-t': false,
        },
      },
    });
    expect(wrapper.find('#category-status-chart-center-label').text()).toBe('This Week 3 Veggies');
  });

  it('renders with totals prop', () => {
    const wrapper = mount(CategoryStatusChart, {
      props: {
        totals: true,
        veggies: ['potato', 'chili'],
      },
      global: {
        stubs: {
          'i18n-t': false,
        },
      },
    });
    expect(wrapper.find('#category-status-chart-center-label').text()).toBe('In Total 2 Actions');
  });

  it('prepares data for CategoryStatusChart', () => {
    const wrapper = mount(CategoryStatusChart, {
      props: {
        // Three roots, two vegetables, one leafy green
        veggies: ['onion', 'garlic', 'tomato', 'endive', 'cucumber', 'carrot'],
      },
    });
    const {
      labels,
      datasets: [{data}],
    } = wrapper.vm.chartData;
    expect(labels).toEqual(['Leafy', 'Vegetable', 'Root']);
    expect(data).toEqual([1, 2, 3]);
  });
});
