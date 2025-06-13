import {describe, it, expect, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import ScreenTestComponent from './ScreenTestComponent.vue';

describe('screen', () => {
  it('detects window resizes', async () => {
    const wrapper = mount(ScreenTestComponent);
    expect(wrapper.vm.visualHeight).toBe(window.innerHeight);
    const originalHeight = window.innerHeight;
    window.innerHeight = originalHeight + 100;
    window.dispatchEvent(new Event('resize'));
    expect(wrapper.vm.visualHeight).toBe(originalHeight + 100);
    window.innerHeight = originalHeight;
    window.dispatchEvent(new Event('resize'));
    expect(wrapper.vm.visualHeight).toBe(originalHeight);
  });

  it('calculates max-height correctly', async () => {
    // Mock getBoundingClientRect
    const mockGetBoundingClientRect = vi.spyOn(Element.prototype, 'getBoundingClientRect');
    mockGetBoundingClientRect.mockReturnValue({
      width: 300,
      height: 500,
      top: 100,
      left: 50,
      right: 350,
      bottom: 600,
      x: 50,
      y: 100,
      toJSON: () => ({}),
    });

    const wrapper = mount(ScreenTestComponent);
    expect(wrapper.vm.maxHeightStyle).toBe('max-height: calc(768px - 100px - 1rem)');
    vi.restoreAllMocks();
  });

  it('adds padding', async () => {
    // Mock getBoundingClientRect
    const mockGetBoundingClientRect = vi.spyOn(Element.prototype, 'getBoundingClientRect');
    mockGetBoundingClientRect.mockReturnValue({
      width: 300,
      height: 500,
      top: 100,
      left: 50,
      right: 350,
      bottom: 600,
      x: 50,
      y: 100,
      toJSON: () => ({}),
    });

    const wrapper = mount(ScreenTestComponent, {
      props: {
        padding: 0,
      },
    });
    expect(wrapper.vm.maxHeightStyle).toBe('max-height: calc(768px - 100px - 0rem)');
    vi.restoreAllMocks();
  });
});
