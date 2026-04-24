import 'temporal-polyfill-lite/global';
import 'temporal-polyfill-lite/types/global';
import {test, expect} from '@playwright/test';

const today = Temporal.Now.plainDateISO();

export const defaultSettings = {
  AIAllowed: null,
  allergens: [] as string[],
  locale: 'en' as const,
  migrationVersion: 4,
  showChartAnimations: true,
  showVeggieFacts: true,
  startDate: today.subtract({days: today.dayOfWeek - 1}),
  suggestionCount: 10,
  summaryViewedDate: null,
};

export {test, expect};
