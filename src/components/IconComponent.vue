<script setup lang="ts">
import {
  mdiArrowDown,
  mdiCarrot,
  mdiCogOutline,
  mdiFruitPear,
  mdiFruitWatermelon,
  mdiRadioboxBlank,
  mdiRadioboxMarked,
  mdiTrashCan,
} from '@mdi/js';

export type IconString =
  | 'carrot'
  | 'cog'
  | 'downArrow'
  | 'pear'
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
  cog: mdiCogOutline,
  downArrow: mdiArrowDown,
  pear: mdiFruitPear,
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
