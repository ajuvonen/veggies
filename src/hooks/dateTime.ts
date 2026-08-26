import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {useAppStateStore} from '@/stores/appStateStore';

export function useDateTime() {
  const {t} = useI18n();
  const {settings} = storeToRefs(useAppStateStore());

  const formatWeekNumber = (weekStart: Temporal.PlainDate) =>
    `${weekStart.weekOfYear}/${weekStart.yearOfWeek}`;

  const formatDate = (date: Temporal.PlainDate, includeYear = false) => {
    const locale = settings.value.locale === 'en' ? 'en-GB' : settings.value.locale;
    return date.toLocaleString(locale, {
      month: 'numeric',
      day: 'numeric',
      year: includeYear ? 'numeric' : undefined,
    });
  };

  const formatWeekString = (weekStart: Temporal.PlainDate) => {
    const weekEnd = weekStart.add({days: 6});
    return t('stats.selectedWeek', [
      formatWeekNumber(weekStart),
      formatDate(weekStart),
      formatDate(weekEnd),
    ]);
  };

  return {
    formatWeekNumber,
    formatWeekString,
    formatDate,
  };
}
