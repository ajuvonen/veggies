<script setup lang="ts">
import {
  mdiChartBar,
  mdiCheckboxBlankOutline,
  mdiCheckboxMarkedOutline,
  mdiCheckCircleOutline,
  mdiChevronDown,
  mdiClose,
  mdiCogOutline,
  mdiEarth,
  mdiMinus,
  mdiPlus,
  mdiRadioboxBlank,
  mdiRadioboxMarked,
  mdiTrashCan,
} from '@mdi/js';

export type IconString =
  | 'chart'
  | 'check'
  | 'checkboxBlank'
  | 'checkboxMarked'
  | 'chevron'
  | 'close'
  | 'cog'
  | 'earth'
  | 'minus'
  | 'plus'
  | 'radioboxBlank'
  | 'radioboxMarked'
  | 'trashCan';

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
  chart: mdiChartBar,
  check: mdiCheckCircleOutline,
  checkboxBlank: mdiCheckboxBlankOutline,
  checkboxMarked: mdiCheckboxMarkedOutline,
  chevron: mdiChevronDown,
  close: mdiClose,
  cog: mdiCogOutline,
  earth: mdiEarth,
  minus: mdiMinus,
  plus: mdiPlus,
  radioboxBlank: mdiRadioboxBlank,
  radioboxMarked: mdiRadioboxMarked,
  trashCan: mdiTrashCan,
};
</script>
<template>
  <svg viewBox="0 0 24 24" aria-hidden="true" :style="{width: size, height: size}">
    <path :d="icons[icon]" class="transition-all"></path>
  </svg>
</template>
