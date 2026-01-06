import {useI18n} from 'vue-i18n';
import {APP_URL} from '@/utils/constants';

export function useShare() {
  const {t} = useI18n();

  const shareSupported = !!navigator.share;

  const shareOrCopy = async (shareKey: string, shareProps: (string | number)[]) =>
    shareSupported
      ? await navigator.share({
          text: t(shareKey, shareProps),
          url: APP_URL,
        })
      : navigator.clipboard.writeText(t(shareKey, [...shareProps, APP_URL]));

  return {
    shareOrCopy,
    shareSupported,
  };
}
