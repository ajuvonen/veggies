import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import CategoryStatus from '@/components/CategoryStatus.vue';

describe('CategoryStatus', () => {
  it('renders', () => {
    const wrapper = mount(CategoryStatus, {
      props: {
        veggies: ['carrot', 'onion', 'ginger'],
      },
      global: {
        stubs: {
          'i18n-t': false,
          CategoryStatusChart: true,
        },
      },
    });
    expect(wrapper.find('#category-status-center-label').text()).toBe('This Week 3 Veggies');
  });

  it('renders with totals prop', () => {
    const wrapper = mount(CategoryStatus, {
      props: {
        totals: true,
        veggies: ['potato', 'chili'],
      },
      global: {
        stubs: {
          'i18n-t': false,
          CategoryStatusChart: true,
        },
      },
    });
    expect(wrapper.find('#category-status-center-label').text()).toBe('In Total 2 Actions');
  });
});
