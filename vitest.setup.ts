import {beforeEach, vi} from 'vitest';
import {config, mount} from '@vue/test-utils';
import {createTestingPinia} from '@pinia/testing';
import createI18n from '@/i18n';
import en from '@/i18n/en.json';
import {KEYS} from '@/utils/constants';
import router from '@/router';
import ButtonComponent from '@/components/ButtonComponent.vue';
import IconComponent from '@/components/IconComponent.vue';
import ContentElement from '@/components/ContentElement.vue';

config.global.plugins = [createI18n(en), router];

config.global.components = {
  ButtonComponent,
  IconComponent,
  ContentElement,
};

config.global.directives = {
  tippy() {},
};

config.global.provide = {
  [KEYS.dropdownStyles]: vi.fn(),
};

const dataTestIdPlugin = (wrapper: ReturnType<typeof mount>) => ({
  findByTestId: (testId: string) => wrapper.find(`[data-test-id='${testId}']`),
  findByText: (selector: string, text: string) =>
    wrapper.findAll(selector).find((node) => {
      return node.text() === text;
    }),
});

config.plugins.VueWrapper.install(dataTestIdPlugin);

vi.mock('canvas-confetti', () => ({
  default: () => false,
}));

// Reset handlers after each test
beforeEach(() => {
  // Clear local storage so state is fresh for each test
  localStorage.clear();
  config.global.plugins[2] = createTestingPinia();
});
