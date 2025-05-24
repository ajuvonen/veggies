<script setup lang="ts">
import {
  mdiCalendarWeekOutline,
  mdiChartBar,
  mdiChartLine,
  mdiCheckboxBlankOutline,
  mdiCheckboxMarkedOutline,
  mdiCheckCircle,
  mdiChevronDoubleDown,
  mdiChevronDoubleUp,
  mdiChevronDown,
  mdiChevronLeftCircle,
  mdiClose,
  mdiCogOutline,
  mdiContentCopy,
  mdiEarth,
  mdiDatabaseExport,
  mdiFormatListChecks,
  mdiHistory,
  mdiDatabaseImport,
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
  | 'chevronLeftCircle'
  | 'close'
  | 'cog'
  | 'contentCopy'
  | 'databaseExport'
  | 'databaseImport'
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
  check: mdiCheckCircle,
  checkboxBlank: mdiCheckboxBlankOutline,
  checkboxMarked: mdiCheckboxMarkedOutline,
  chevronDoubleDown: mdiChevronDoubleDown,
  chevronDoubleUp: mdiChevronDoubleUp,
  chevronDown: mdiChevronDown,
  chevronLeftCircle: mdiChevronLeftCircle,
  close: mdiClose,
  cog: mdiCogOutline,
  contentCopy: mdiContentCopy,
  databaseExport: mdiDatabaseExport,
  databaseImport: mdiDatabaseImport,
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
