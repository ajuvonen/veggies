<script setup lang="ts">
import {
  mdiArrowLeftBoldOutline,
  mdiCalendarWeekOutline,
  mdiChartBar,
  mdiChartLine,
  mdiCheck,
  mdiCheckboxBlankOutline,
  mdiCheckboxMarkedOutline,
  mdiChevronDoubleDown,
  mdiChevronDoubleUp,
  mdiChevronDown,
  mdiClose,
  mdiCogOutline,
  mdiContentCopy,
  mdiDatabaseExport,
  mdiDatabaseImport,
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
  arrowLeft: mdiArrowLeftBoldOutline,
  bluesky: siBluesky.path,
  calendarWeek: mdiCalendarWeekOutline,
  chart: mdiChartBar,
  chartLine: mdiChartLine,
  check: mdiCheck,
  checkboxBlank: mdiCheckboxBlankOutline,
  checkboxMarked: mdiCheckboxMarkedOutline,
  chevronDoubleDown: mdiChevronDoubleDown,
  chevronDoubleUp: mdiChevronDoubleUp,
  chevronDown: mdiChevronDown,
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
  trophy: mdiTrophyOutline,
} as const;

export type IconString = keyof typeof icons;
</script>
<template>
  <svg :style="{width: size, height: size}" class="shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path :d="icons[icon]" class="transition-all"></path>
  </svg>
</template>
