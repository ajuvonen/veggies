import {useI18n} from 'vue-i18n';
import type {DateTime} from 'luxon';

export function useDateTime() {
  const {t, locale} = useI18n();

  const formatWeekString = (weekStart: DateTime) =>
    t('stats.selectedWeek', [
      weekStart.toFormat('W/kkkk'),
      weekStart.setLocale(locale.value).toLocaleString({month: 'numeric', day: 'numeric'}),
      weekStart
        .setLocale(locale.value)
        .endOf('week')
        .toLocaleString({month: 'numeric', day: 'numeric'}),
    ]);

  return {
    formatWeekString,
  };
}
