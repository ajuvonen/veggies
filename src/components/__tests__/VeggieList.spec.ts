import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import VeggieList from '@/components/VeggieList.vue';

describe('VeggieList', () => {
  it('renders', () => {
    const wrapper = mount(VeggieList, {
      props: {
        uniqueVeggies: [],
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
    });
    uniqueVeggies.forEach((veggie) => {
      expect(wrapper.findByTestId(`veggie-list-status-${veggie}`).text()).toBe('(complete)');
    });
  });
});
