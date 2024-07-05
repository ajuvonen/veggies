import {afterEach} from 'vitest';
import {config, mount} from '@vue/test-utils';
import {createTestingPinia} from '@pinia/testing';
import i18n from './src/i18n';
import router from './src/router';

config.global.plugins = [createTestingPinia(), i18n, router];

const dataTestIdPlugin = (wrapper: ReturnType<typeof mount>) => ({
  findByTestId: (testId: string) => wrapper.find(`[data-test-id='${testId}']`),
});

config.plugins.VueWrapper.install(dataTestIdPlugin);

// Reset handlers after each test
afterEach(() => {
  // Clear local storage so state is fresh for each test
  localStorage.clear();
  config.global.plugins[0] = createTestingPinia();
});
