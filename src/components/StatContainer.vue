<script setup lang="ts">
import {useShare} from '@/hooks/share';

defineProps<{
  statAmount: number;
  statKey: string;
}>();

const {shareSupported, shareOrCopy} = useShare();
</script>
<template>
  <i18n-t scope="global" keypath="categoryStatus.centerLabel">
    <span class="select-none">{{ $t(`allTimeStatus.${statKey}.topLabel`) }}</span>
    <span class="text-5xl select-none">{{ statAmount }}</span>
    <span class="select-none">{{ $t(`allTimeStatus.${statKey}.bottomLabel`, statAmount) }}</span>
  </i18n-t>
  <ButtonComponent
    v-tippy="shareSupported ? $t('general.share') : $t('general.copy')"
    :icon="shareSupported ? 'shareVariant' : 'contentCopy'"
    :aria-label="shareSupported ? $t('general.share') : $t('general.copy')"
    :data-test-id="
      shareSupported
        ? `stat-container-share-button-${statKey}`
        : `stat-container-copy-button-${statKey}`
    "
    variant="text"
    class="absolute left-[calc(50%+3rem)]"
    @click="shareOrCopy(`allTimeStatus.${statKey}.shareText`, [statAmount])"
  />
</template>
