<script setup lang="ts">
import {
  mdiButterflyOutline,
  mdiCalendarWeekOutline,
  mdiChartBar,
  mdiChartLine,
  mdiCheckboxBlankOutline,
  mdiCheckboxMarkedOutline,
  mdiCheckCircleOutline,
  mdiChevronDown,
  mdiClose,
  mdiCogOutline,
  mdiEarth,
  mdiFormatListChecks,
  mdiHistory,
  mdiMinus,
  mdiPlus,
  mdiRadioboxBlank,
  mdiRadioboxMarked,
  mdiTrashCan,
  mdiTrophyOutline,
} from '@mdi/js';

export type IconString =
  | 'butterflyOutline'
  | 'calendarWeekOutline'
  | 'chart'
  | 'chartLine'
  | 'check'
  | 'checkboxBlank'
  | 'checkboxMarked'
  | 'chevron'
  | 'close'
  | 'cog'
  | 'earth'
  | 'formatListChecks'
  | 'history'
  | 'minus'
  | 'plus'
  | 'radioboxBlank'
  | 'radioboxMarked'
  | 'trashCan'
  | 'trophyOutline';

withDefaults(
  defineProps<{
    icon: IconString;
    size?: string;
  }>(),
  {
    size: '1.25rem',
  },
);

const icons = {
  butterflyOutline: mdiButterflyOutline,
  calendarWeekOutline: mdiCalendarWeekOutline,
  chart: mdiChartBar,
  chartLine: mdiChartLine,
  check: mdiCheckCircleOutline,
  checkboxBlank: mdiCheckboxBlankOutline,
  checkboxMarked: mdiCheckboxMarkedOutline,
  chevron: mdiChevronDown,
  close: mdiClose,
  cog: mdiCogOutline,
  earth: mdiEarth,
  formatListChecks: mdiFormatListChecks,
  history: mdiHistory,
  minus: mdiMinus,
  plus: mdiPlus,
  radioboxBlank: mdiRadioboxBlank,
  radioboxMarked: mdiRadioboxMarked,
  trashCan: mdiTrashCan,
  trophyOutline: mdiTrophyOutline,
};
</script>
<template>
  <svg
    :style="{width: size, height: size}"
    class="flex-shrink-0"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path :d="icons[icon]" class="transition-all"></path>
  </svg>
</template>
