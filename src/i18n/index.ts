import {createI18n} from 'vue-i18n';
import en from './en.json';
import fi from './fi.json';
import type {Locale} from '@/utils/types';

type MessageSchema = typeof en;

export default createI18n<[MessageSchema], Locale>({
  locale: 'en',
  fallbackLocale: 'en',
  legacy: false,
  allowComposition: true,
  messages: {
    en,
    fi,
  },
});
