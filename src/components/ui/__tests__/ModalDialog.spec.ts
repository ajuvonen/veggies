import {describe, it, expect} from 'vitest';
import {mount, flushPromises} from '@vue/test-utils';
import {DialogContent} from 'reka-ui';
import ModalDialog from '@/components/ui/ModalDialog.vue';

describe('ModalDialog', () => {
  it('renders closed', async () => {
    const wrapper = mount(ModalDialog, {
      props: {title: 'Test dialog', modelValue: false},
    });
    await flushPromises();
    const dialog = wrapper.getComponent(DialogContent);
    expect(dialog.isVisible()).toBe(false);
  });

  it('shows dialog', async () => {
    const wrapper = mount(ModalDialog, {
      props: {title: 'Test dialog', modelValue: true},
    });
    await flushPromises();
    const dialog = wrapper.getComponent(DialogContent);
    expect(dialog.isVisible()).toBe(true);
    expect(dialog.html()).toMatchSnapshot();
    expect(dialog.findByTestId('dialog-close-button').isVisible()).toBe(true);
  });

  it('renders content', async () => {
    const wrapper = mount(ModalDialog, {
      props: {title: 'Test dialog', modelValue: true},
      slots: {
        content: '<p>Test content</p>',
        buttons: '<p>Test buttons</p>',
      },
    });
    await flushPromises();
    const dialog = wrapper.getComponent(DialogContent);
    expect(dialog.isVisible()).toBe(true);
    expect(dialog.findByText('p', 'Test content').isVisible()).toBe(true);
    expect(dialog.findByText('p', 'Test buttons').isVisible()).toBe(true);
    expect(dialog.findByTestId('dialog-close-button').exists()).toBe(false);
  });

  it('closes dialog on button click', async () => {
    const wrapper = mount(ModalDialog, {
      props: {title: 'Test dialog', modelValue: true},
    });
    await flushPromises();
    const dialog = wrapper.getComponent(DialogContent);
    await dialog.findByTestId('dialog-close-button').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
  });
});
