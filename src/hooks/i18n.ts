import {computed} from 'vue';
import {useI18n} from 'vue-i18n';

export const useI18nWithCollator = () => {
  const i18n = useI18n();

  const collator = computed(() => new Intl.Collator(i18n.locale.value));

  return {
    ...i18n,
    collator,
  };
};
