import {describe, it, expect, vi, beforeEach} from 'vitest';
import {ref, nextTick, type Ref} from 'vue';
import {useChartContainer} from '@/hooks/chartContainer';
import {withSetup} from './testHelpers';

// Mock VueUse composables
const mockMouseX = ref(500);
const mockMouseY = ref(300);
const mockTop = ref(100);
const mockBottom = ref(400);

vi.mock('@vueuse/core', () => ({
  useMouse: () => ({
    x: mockMouseX,
    y: mockMouseY,
  }),
  useElementBounding: () => ({
    top: mockTop,
    bottom: mockBottom,
  }),
}));

// Mock window properties
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1000,
});

describe('useChartContainer', () => {
  let chartContainer: Ref<HTMLDivElement | null>;
  let mockDiv: HTMLDivElement;

  beforeEach(() => {
    // Reset mock values
    mockMouseX.value = 500;
    mockMouseY.value = 300;
    mockTop.value = 100;
    mockBottom.value = 400;
    window.innerWidth = 1000; // Center at 500

    // Create mock div element
    mockDiv = {
      scrollLeft: 0,
      scrollWidth: 1200,
    } as HTMLDivElement;

    chartContainer = ref(mockDiv);
  });

  it('scrolls container to the right when element exists', async () => {
    withSetup(useChartContainer, chartContainer);

    // Wait for onMounted to execute
    await nextTick();

    expect(mockDiv.scrollLeft).toBe(1200);
  });

  it('does not throw error when container is null', async () => {
    chartContainer.value = null;

    expect(withSetup(useChartContainer, chartContainer)).toBeDefined();
  });

  it('returns "top" when mouse is above element center', () => {
    // Element center is at (100 + 400) / 2 = 250
    mockMouseY.value = 200; // Above center

    const {yAlign} = withSetup(useChartContainer, chartContainer);

    expect(yAlign()).toBe('top');
  });

  it('returns "bottom" when mouse is below or at element center', () => {
    const {yAlign} = withSetup(useChartContainer, chartContainer);

    // Test below center
    mockMouseY.value = 300; // Below center
    expect(yAlign()).toBe('bottom');

    // Test exactly at center
    mockMouseY.value = 250; // Exactly at center
    expect(yAlign()).toBe('bottom');
  });

  it('reacts to changes in element bounds', () => {
    const {yAlign} = withSetup(useChartContainer, chartContainer);

    mockMouseY.value = 200;
    mockTop.value = 50;
    mockBottom.value = 350;
    // New center: (50 + 350) / 2 = 200

    expect(yAlign()).toBe('bottom'); // Mouse at center now
  });

  it('returns "left" when mouse is in left zone', () => {
    mockMouseX.value = 400; // Less than 500 - 50 = 450

    const {xAlign} = withSetup(useChartContainer, chartContainer);

    expect(xAlign()).toBe('left');
  });

  it('returns "right" when mouse is in right zone', () => {
    mockMouseX.value = 600; // Greater than 500 + 50 = 550

    const {xAlign} = withSetup(useChartContainer, chartContainer);

    expect(xAlign()).toBe('right');
  });

  it('returns "center" for center zone and boundaries', () => {
    const {xAlign} = withSetup(useChartContainer, chartContainer);

    // Test center zone
    mockMouseX.value = 500; // Between 450 and 550
    expect(xAlign()).toBe('center');

    // Test left boundary
    mockMouseX.value = 450; // Exactly at left boundary
    expect(xAlign()).toBe('center');

    // Test right boundary
    mockMouseX.value = 550; // Exactly at right boundary
    expect(xAlign()).toBe('center');
  });

  it('adapts to different window widths', () => {
    const {xAlign} = withSetup(useChartContainer, chartContainer);

    // Test with smaller window
    window.innerWidth = 800; // Center at 400
    mockMouseX.value = 320; // Less than 400 - 50 = 350
    expect(xAlign()).toBe('left');

    mockMouseX.value = 400;
    expect(xAlign()).toBe('center');

    mockMouseX.value = 480; // Greater than 400 + 50 = 450
    expect(xAlign()).toBe('right');
  });

  it('uses element bounds from useElementBounding', () => {
    // Change bounds first, before creating the composable
    mockTop.value = 200;
    mockBottom.value = 600;
    mockMouseY.value = 450; // Below new center of 400

    const {yAlign} = withSetup(useChartContainer, chartContainer);

    // Center is (200 + 600) / 2 = 400
    // mouseY = 450, which is > 400, so should be 'bottom'
    expect(yAlign()).toBe('bottom');
  });
});
