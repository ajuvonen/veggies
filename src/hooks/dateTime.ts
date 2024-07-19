import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {DateTime} from 'luxon';
import {useActivityStore} from '@/stores/activityStore';
import {DATE_FORMATS} from '@/utils/constants';
import type {Locale} from '@/utils/types';

export default function useDateTime() {
  const {settings} = storeToRefs(useActivityStore());
  const {locale} = useI18n();

  const getWeekStart = computed(() => (weekIndex: number) => {
    const startDate = settings.value.startDate
      ? settings.value.startDate
      : DateTime.now().startOf('week');
    return startDate.plus({
      weeks: weekIndex,
    });
  });

  const getTotalWeeks = computed(() =>
    Math.ceil(DateTime.now().diff(settings.value.startDate!, 'week').weeks),
  );

  const getWeekStarts = computed(() =>
    [...Array(getTotalWeeks.value)].map((_, index) => getWeekStart.value(index)),
  );

  const getDateInterval = computed(() => (weekIndex: number) => {
    const formattedStart = getWeekStart
      .value(weekIndex)
      .toFormat(DATE_FORMATS[locale.value as Locale]);
    const formattedEnd = getWeekStart
      .value(weekIndex)
      .plus({days: 6})
      .endOf('day')
      .toFormat(DATE_FORMATS[locale.value as Locale]);
    return `${formattedStart} - ${formattedEnd}`;
  });

  return {getTotalWeeks, getWeekStarts, getDateInterval};
}
