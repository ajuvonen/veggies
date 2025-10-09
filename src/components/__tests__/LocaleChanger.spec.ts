import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {useI18n, type Composer, type VueMessageType} from 'vue-i18n';
import type {DateTimeFormat, LocaleMessage, NumberFormat} from '@intlify/core-base';
import {useAppStateStore} from '@/stores/appStateStore';
import {ALL_VEGGIES} from '@/utils/veggieDetails';
import {DEFAULT_LOCALE, LOCALES} from '@/utils/constants';
import LocaleChanger from '@/components/LocaleChanger.vue';

const mountLocalization = () =>
  new Promise<
    Composer<
      {
        [x: string]: LocaleMessage<VueMessageType>;
      },
      {
        [x: string]: DateTimeFormat;
      },
      {
        [x: string]: NumberFormat;
      },
      string,
      string,
      string
    >
  >((resolve) => {
    mount({
      shallow: true,
      template: '<div />',
      setup() {
        resolve(useI18n());
      },
    });
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFlattenedKeys = (obj: any, prefix = ''): string[] => {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'object' && value !== null && !Array.isArray(value)
      ? getFlattenedKeys(value, fullKey)
      : [fullKey];
  });
};

const {default: defaultMessages} = await import(`@/i18n/${DEFAULT_LOCALE}.json`);

describe('LocaleChanger', () => {
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    appStateStore = useAppStateStore();
  });

  it('renders', () => {
    const wrapper = mount(LocaleChanger);
    expect(wrapper).toBeTruthy();
  });

  it('shows available languages', () => {
    const wrapper = mount(LocaleChanger);
    const options = wrapper.findAll('.button-like');
    expect(options).toHaveLength(2);
    expect(options.some((button) => button.text() === 'English')).toBe(true);
    expect(options.some((button) => button.text() === 'Suomi')).toBe(true);
  });

  it('changes language', async () => {
    const wrapper = mount(LocaleChanger);
    expect(appStateStore.settings.locale).toBe('en');
    await wrapper.findAll('.button-like')[1].trigger('click');
    expect(appStateStore.settings.locale).toBe('fi');
  });

  it('has translation for all veggies', async () => {
    const {t, tm} = await mountLocalization();
    ALL_VEGGIES.forEach((veggie) =>
      expect.soft(t(`veggies.${veggie}`)).not.toBe(`veggies.${veggie}`),
    );
    expect(Object.keys(tm('veggies')).length).toEqual(ALL_VEGGIES.length);
  });

  it('has facts for all veggies', async () => {
    const {tm} = await mountLocalization();
    ALL_VEGGIES.forEach((veggie) => expect.soft(tm(`facts.${veggie}`).length).toBeGreaterThan(1));
    expect(Object.keys(tm('facts')).length).toEqual(ALL_VEGGIES.length);
  });

  it.each(LOCALES.filter((locale) => locale !== DEFAULT_LOCALE))(
    '%s keys match default locale',
    async (locale) => {
      const {default: messages} = await import(`@/i18n/${locale}.json`);
      expect(new Set(getFlattenedKeys(messages))).toEqual(
        new Set(getFlattenedKeys(defaultMessages)),
      );
    },
  );
});
