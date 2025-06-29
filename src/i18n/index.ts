import {createI18n} from 'vue-i18n';
import {DEFAULT_LOCALE, LOCALES} from '@/utils/constants';

export default function (defaultMessages?: typeof import('./en.json')) {
  return createI18n({
    availableLocales: LOCALES,
    fallbackLocale: DEFAULT_LOCALE,
    legacy: false,
    locale: DEFAULT_LOCALE,
    messages: defaultMessages
      ? {
          [DEFAULT_LOCALE]: defaultMessages,
        }
      : undefined,
  });
}
