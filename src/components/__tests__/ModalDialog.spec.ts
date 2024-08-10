import {describe, it, expect} from 'vitest';
import {mount, type ComponentMountingOptions} from '@vue/test-utils';
import ModalDialog from '@/components/ModalDialog.vue';
import DialogStub from './DialogStub.vue';

const mounter = (options?: Partial<ComponentMountingOptions<typeof ModalDialog>>) =>
  mount(ModalDialog, {
    ...options,
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

describe('ModalDialog', () => {
  it('renders closed', () => {
    const wrapper = mount(ModalDialog, {
      props: {
        title: 'Test dialog',
        open: false,
      },
    });
    expect(wrapper).toBeTruthy();
    expect(wrapper.find('.modal-dialog').exists()).toBe(false);
  });

  it('shows dialog', () => {
    const wrapper = mounter({
      props: {
        title: 'Test dialog',
        open: true,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.find('.modal-dialog').exists()).toBe(true);
  });

  it('renders content', () => {
    const wrapper = mounter({
      props: {
        title: 'Test dialog',
        open: true,
      },
      slots: {
        content: '<p>Test content</p>',
        buttons: '<p>Test buttons</p>',
      },
    });
    expect(wrapper.findByText('p', 'Test content').exists()).toBe(true);
    expect(wrapper.findByText('p', 'Test buttons').exists()).toBe(true);
  });

  it('closes dialog on button click', async () => {
    const wrapper = mounter({
      props: {
        title: 'Test dialog',
        open: true,
      },
    });
    await wrapper.findByText('button', 'Close').trigger('click');
    expect(wrapper.emitted('close')).toEqual([[]]);
  });
});