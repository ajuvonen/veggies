import {createI18n} from 'vue-i18n';
import en from './en.json';
import fi from './fi.json';
import type {Locale} from '@/utils/types';
import {DEFAULT_LOCALE} from '@/utils/constants';

type MessageSchema = typeof en;

export default createI18n<[MessageSchema], Locale>({
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  legacy: false,
  messages: {
    en,
    fi,
  },
});
