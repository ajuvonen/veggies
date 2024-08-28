<script setup lang="ts">
import {
  mdiApple,
  mdiCarrot,
  mdiChartBar,
  mdiCheckCircleOutline,
  mdiChevronDown,
  mdiClose,
  mdiCogOutline,
  mdiEarth,
  mdiFruitPear,
  mdiFruitWatermelon,
  mdiMinus,
  mdiPlus,
  mdiRadioboxBlank,
  mdiRadioboxMarked,
  mdiTrashCan,
} from '@mdi/js';

export type IconString =
  | 'apple'
  | 'carrot'
  | 'chart'
  | 'check'
  | 'chevron'
  | 'close'
  | 'cog'
  | 'earth'
  | 'minus'
  | 'pear'
  | 'plus'
  | 'radioboxBlank'
  | 'radioboxMarked'
  | 'trashCan'
  | 'watermelon';

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
  apple: mdiApple,
  carrot: mdiCarrot,
  chart: mdiChartBar,
  check: mdiCheckCircleOutline,
  chevron: mdiChevronDown,
  close: mdiClose,
  cog: mdiCogOutline,
  earth: mdiEarth,
  minus: mdiMinus,
  pear: mdiFruitPear,
  plus: mdiPlus,
  radioboxBlank: mdiRadioboxBlank,
  radioboxMarked: mdiRadioboxMarked,
  trashCan: mdiTrashCan,
  watermelon: mdiFruitWatermelon,
};
</script>
<template>
  <svg viewBox="0 0 24 24" aria-hidden="true" :style="{width: size, height: size}">
    <path :d="icons[icon]" class="transition-all"></path>
  </svg>
</template>
