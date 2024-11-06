import {afterAll, beforeAll, beforeEach, vi} from 'vitest';
import {config, mount} from '@vue/test-utils';
import {createTestingPinia} from '@pinia/testing';
import i18n from './src/i18n';
import router from './src/router';
import ButtonComponent from './src/components/ButtonComponent.vue';
import IconComponent from './src/components/IconComponent.vue';
import ContentElement from './src/components/ContentElement.vue';

config.global.plugins = [i18n, router];

config.global.components = {
  ButtonComponent,
  IconComponent,
  ContentElement,
};

const dataTestIdPlugin = (wrapper: ReturnType<typeof mount>) => ({
  findByTestId: (testId: string) => wrapper.find(`[data-test-id='${testId}']`),
  findByText: (selector: string, text: string) =>
    wrapper.findAll(selector).find((node) => {
      return node.text() === text;
    }),
});

config.plugins.VueWrapper.install(dataTestIdPlugin);

beforeAll(() => {
  vi.mock('vue-chartjs', () => ({
    Doughnut: {
      template: '<div></div>',
    },
    PolarArea: {
      template: '<div></div>',
    },
    Line: {
      template: '<div></div>',
    },
    Bar: {
      template: '<div></div>',
    },
  }));
});

afterAll(() => {
  vi.restoreAllMocks();
});

// Reset handlers after each test
beforeEach(() => {
  // Clear local storage so state is fresh for each test
  localStorage.clear();
  config.global.plugins[2] = createTestingPinia();
});
