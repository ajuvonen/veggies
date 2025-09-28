import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import type {DateTime} from 'luxon';
import {useAppStateStore} from '@/stores/appStateStore';

export function useDateTime() {
  const {t} = useI18n();
  const {settings} = storeToRefs(useAppStateStore());

  const formatWeekNumber = (weekStart: DateTime) => weekStart.toFormat('W/kkkk');

  const formatWeekString = (weekStart: DateTime) => {
    const locale = settings.value.locale === 'en' ? 'en-GB' : settings.value.locale;
    return t('stats.selectedWeek', [
      formatWeekNumber(weekStart),
      weekStart.setLocale(locale).toLocaleString({month: 'numeric', day: 'numeric'}),
      weekStart.setLocale(locale).endOf('week').toLocaleString({month: 'numeric', day: 'numeric'}),
    ]);
  };

  return {
    formatWeekNumber,
    formatWeekString,
  };
}
