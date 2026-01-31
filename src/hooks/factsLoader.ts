import {useI18n} from 'vue-i18n';
import type {Locale} from '@/types';

export function useFactsLoader() {
  const {te, mergeLocaleMessage} = useI18n();

  return async (locale: Locale): Promise<void> => {
    // Check if facts namespace already exists for this locale
    if (!te('facts', locale)) {
      const {default: facts} = await import(`@/i18n/facts_${locale}.json`);
      mergeLocaleMessage(locale, facts);
    }
  };
}
