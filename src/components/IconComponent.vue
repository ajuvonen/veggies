<script setup lang="ts">
import {mdiCogOutline, mdiRadioboxBlank, mdiRadioboxMarked, mdiTrashCan} from '@mdi/js';

export type IconString = 'cog' | 'radioboxBlank' | 'radioboxMarked' | 'trashCan';

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
  cog: mdiCogOutline,
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
