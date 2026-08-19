import {describe, it, expect, afterEach} from 'vitest';
import {mount, flushPromises, enableAutoUnmount} from '@vue/test-utils';
import {DialogContent} from 'reka-ui';
import HomeInfoDialog from '@/components/HomeInfoDialog.vue';

describe('HomeInfoDialog', () => {
  enableAutoUnmount(afterEach);

  it('opens at first step with previous button disabled', async () => {
    const wrapper = mount(HomeInfoDialog, {
      props: {modelValue: true},
    });
    await flushPromises();
    const dialog = wrapper.getComponent(DialogContent);

    expect(dialog.isVisible()).toBe(true);
    expect(dialog.findByTestId('dialog-title').text()).toBe('Briefly');
    expect(dialog.findByTestId('home-info-previous-button').attributes('aria-disabled')).toBe(
      'true',
    );
    expect(dialog.findByTestId('home-info-next-button').exists()).toBe(true);
  });

  it('navigates forward and backward, changing titles and content', async () => {
    const wrapper = mount(HomeInfoDialog, {
      props: {modelValue: true},
    });
    await flushPromises();
    const dialog = wrapper.getComponent(DialogContent);

    await dialog.findByTestId('home-info-next-button').trigger('click');

    expect(dialog.findByTestId('dialog-title').text()).toBe('Background');
    expect(dialog.findByTestId('home-info-previous-button').attributes('aria-disabled')).toBe(
      undefined,
    );

    await dialog.findByTestId('home-info-next-button').trigger('click');

    expect(dialog.findByTestId('dialog-title').text()).toBe('Features');

    await dialog.findByTestId('home-info-previous-button').trigger('click');

    expect(dialog.findByTestId('dialog-title').text()).toBe('Background');
    expect(dialog.findByTestId('home-info-next-button').exists()).toBe(true);
  });

  it('resets to the first step when reopened', async () => {
    const wrapper = mount(HomeInfoDialog, {
      props: {modelValue: true},
    });
    await flushPromises();
    const dialog = wrapper.getComponent(DialogContent);

    await dialog.findByTestId('home-info-next-button').trigger('click');
    expect(dialog.findByTestId('dialog-title').text()).toBe('Background');

    await wrapper.setProps({modelValue: false});
    await flushPromises();
    await wrapper.setProps({modelValue: true});
    await flushPromises();

    expect(dialog.findByTestId('dialog-title').text()).toBe('Briefly');
    expect(dialog.findByTestId('home-info-previous-button').attributes('aria-disabled')).toBe(
      'true',
    );
  });

  it('closes the dialog when clicking close on the last step', async () => {
    const wrapper = mount(HomeInfoDialog, {
      props: {modelValue: true},
    });
    await flushPromises();
    const dialog = wrapper.getComponent(DialogContent);

    await dialog.findByTestId('home-info-next-button').trigger('click');
    await dialog.findByTestId('home-info-next-button').trigger('click');

    expect(dialog.findByTestId('dialog-title').text()).toBe('Features');
    expect(dialog.findByTestId('home-info-next-button').exists()).toBe(false);
    expect(dialog.findByTestId('home-info-close-button').exists()).toBe(true);

    await dialog.findByTestId('home-info-close-button').trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
  });
});
