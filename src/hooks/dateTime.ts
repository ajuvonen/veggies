import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {useAppStateStore} from '@/stores/appStateStore';

export function useDateTime() {
  const {t} = useI18n();
  const {settings} = storeToRefs(useAppStateStore());

  const formatWeekNumber = (weekStart: Temporal.PlainDate) =>
    `${weekStart.weekOfYear}/${weekStart.yearOfWeek}`;

  const formatWeekString = (weekStart: Temporal.PlainDate) => {
    const locale = settings.value.locale === 'en' ? 'en-GB' : settings.value.locale;
    const weekEnd = weekStart.add({days: 6});
    return t('stats.selectedWeek', [
      formatWeekNumber(weekStart),
      weekStart.toLocaleString(locale, {month: 'numeric', day: 'numeric'}),
      weekEnd.toLocaleString(locale, {month: 'numeric', day: 'numeric'}),
    ]);
  };

  return {
    formatWeekNumber,
    formatWeekString,
  };
}
