<script setup lang="ts">
import {
  mdiArrowDown,
  mdiCarrot,
  mdiChartBar,
  mdiChevronDown,
  mdiCogOutline,
  mdiFruitPear,
  mdiFruitWatermelon,
  mdiMinus,
  mdiPlus,
  mdiRadioboxBlank,
  mdiRadioboxMarked,
  mdiTrashCan,
} from '@mdi/js';

export type IconString =
  | 'carrot'
  | 'chart'
  | 'chevron'
  | 'cog'
  | 'downArrow'
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
  carrot: mdiCarrot,
  chart: mdiChartBar,
  chevron: mdiChevronDown,
  cog: mdiCogOutline,
  downArrow: mdiArrowDown,
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
