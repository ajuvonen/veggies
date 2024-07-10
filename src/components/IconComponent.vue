<script setup lang="ts">
import {mdiCogOutline, mdiRadioboxBlank, mdiRadioboxMarked, mdiTrashCan} from '@mdi/js';

export type IconString = 'cog' | 'radioboxBlank' | 'radioboxMarked' | 'trashCan';

defineProps<{
  icon: IconString;
}>();

const icons = {
  cog: mdiCogOutline,
  radioboxBlank: mdiRadioboxBlank,
  radioboxMarked: mdiRadioboxMarked,
  trashCan: mdiTrashCan,
};
</script>
<template>
  <svg viewBox="0 0 24 24" aria-hidden="true" class="w-5 h-5">
    <path :d="icons[icon]" class="transition-all"></path>
  </svg>
</template>
