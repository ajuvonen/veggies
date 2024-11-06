import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import VeggieList from '@/components/VeggieList.vue';

describe('VeggieList', () => {
  it('renders', () => {
    const wrapper = mount(VeggieList, {
      props: {
        uniqueVeggies: [],
      },
      global: {
        stubs: {
          VeggieCompletionChart: true,
        },
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders with data', () => {
    const uniqueVeggies = ['wheat', 'apple', 'cucumber', 'lychee'];
    const wrapper = mount(VeggieList, {
      props: {
        uniqueVeggies,
      },
      global: {
        stubs: {
          VeggieCompletionChart: true,
        },
      },
    });
    uniqueVeggies.forEach((veggie) => {
      expect(wrapper.findByTestId(`veggie-list-status-${veggie}`).text()).toBe('(complete)');
    });
  });
});
