import {createI18n} from 'vue-i18n';
import en from './en.json';
import fi from './fi.json';

type MessageSchema = typeof en;

export default createI18n<[MessageSchema], 'en' | 'fi'>({
  locale: 'en',
  fallbackLocale: 'en',
  legacy: false,
  allowComposition: true,
  messages: {
    en,
    fi,
  },
});
