import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import {BLUESKY_URL, PLAY_STORE_URL} from '@/utils/constants';
import FooterComponent from '@/components/FooterComponent.vue';

describe('FooterComponent', () => {
  it('renders', () => {
    const wrapper = mount(FooterComponent);
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.findByTestId('bluesky-link').attributes('href')).toBe(BLUESKY_URL);
  });

  it('renders with play store link', async () => {
    const originalNavigator = navigator.userAgent;
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36',
      configurable: true,
    });
    const wrapper = mount(FooterComponent);
    try {
      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapper.findByTestId('bluesky-link').exists()).toBe(true);
      expect(wrapper.findByTestId('play-store-link').exists()).toBe(true);
      expect(wrapper.findByTestId('play-store-link').attributes('href')).toBe(PLAY_STORE_URL);
    } finally {
      Object.defineProperty(navigator, 'userAgent', {
        value: originalNavigator,
        configurable: true,
      });
    }
  });

  it('does not render play store link in webview', async () => {
    const originalNavigator = navigator.userAgent;
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36 **wv**',
      configurable: true,
    });
    const wrapper = mount(FooterComponent);
    try {
      expect(wrapper.findByTestId('bluesky-link').exists()).toBe(true);
      expect(wrapper.findByTestId('play-store-link').exists()).toBe(false);
    } finally {
      Object.defineProperty(navigator, 'userAgent', {
        value: originalNavigator,
        configurable: true,
      });
    }
  });
});
