<script setup lang="ts">
import {
  mdiCalendarWeekOutline,
  mdiChartBar,
  mdiChartLine,
  mdiCheckboxBlankOutline,
  mdiCheckboxMarkedOutline,
  mdiCheckCircleOutline,
  mdiChevronDoubleDown,
  mdiChevronDoubleUp,
  mdiChevronDown,
  mdiChevronLeft,
  mdiClose,
  mdiCogOutline,
  mdiContentCopy,
  mdiEarth,
  mdiFormatListChecks,
  mdiHistory,
  mdiMinus,
  mdiPlus,
  mdiRadioboxBlank,
  mdiRadioboxMarked,
  mdiShareVariant,
  mdiTrashCan,
  mdiTrophyOutline,
} from '@mdi/js';
import {siBluesky} from 'simple-icons';

export type IconString =
  | 'bluesky'
  | 'calendarWeekOutline'
  | 'chart'
  | 'chartLine'
  | 'check'
  | 'checkboxBlank'
  | 'checkboxMarked'
  | 'chevronDoubleDown'
  | 'chevronDoubleUp'
  | 'chevronDown'
  | 'chevronLeft'
  | 'close'
  | 'cog'
  | 'contentCopy'
  | 'earth'
  | 'formatListChecks'
  | 'history'
  | 'minus'
  | 'plus'
  | 'radioboxBlank'
  | 'radioboxMarked'
  | 'shareVariant'
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
  bluesky: siBluesky.path,
  calendarWeekOutline: mdiCalendarWeekOutline,
  chart: mdiChartBar,
  chartLine: mdiChartLine,
  check: mdiCheckCircleOutline,
  checkboxBlank: mdiCheckboxBlankOutline,
  checkboxMarked: mdiCheckboxMarkedOutline,
  chevronDoubleDown: mdiChevronDoubleDown,
  chevronDoubleUp: mdiChevronDoubleUp,
  chevronDown: mdiChevronDown,
  chevronLeft: mdiChevronLeft,
  close: mdiClose,
  cog: mdiCogOutline,
  contentCopy: mdiContentCopy,
  earth: mdiEarth,
  formatListChecks: mdiFormatListChecks,
  history: mdiHistory,
  minus: mdiMinus,
  plus: mdiPlus,
  radioboxBlank: mdiRadioboxBlank,
  radioboxMarked: mdiRadioboxMarked,
  shareVariant: mdiShareVariant,
  trashCan: mdiTrashCan,
  trophyOutline: mdiTrophyOutline,
} as const;
</script>
<template>
  <svg :style="{width: size, height: size}" class="shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path :d="icons[icon]" class="transition-all"></path>
  </svg>
</template>
