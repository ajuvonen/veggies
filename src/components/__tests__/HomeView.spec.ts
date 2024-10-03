import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import HomeView from '@/views/HomeView.vue';
import DialogStub from './DialogStub.vue';

describe('HomeView', () => {
  it('renders', () => {
    const wrapper = mount(HomeView);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows dialog', async () => {
    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          Dialog: DialogStub,
          DialogPanel: {
            template: '<div><slot /></div>',
          },
          DialogTitle: true,
        },
      },
    });
    expect(wrapper.findByTestId('dialog').exists()).toBe(false);
    await wrapper.findByTestId('home-info-button').trigger('click');
    expect(wrapper.findByTestId('dialog').exists()).toBe(true);
  });
});
