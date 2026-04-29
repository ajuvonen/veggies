<script setup lang="ts">
import {useShare} from '@/hooks/share';

defineProps<{
  statAmount: number;
  statKey: string;
}>();

const {shareSupported, shareOrCopy} = useShare();
</script>
<template>
  <div class="all-time-status__item" :data-test-id="`all-time-status-${statKey}`">
    <i18n-t scope="global" keypath="categoryStatus.centerLabel">
      <span>{{ $t(`allTimeStatus.${statKey}.topLabel`) }}</span>
      <span class="text-5xl">{{ statAmount }}</span>
      <span>{{ $t(`allTimeStatus.${statKey}.bottomLabel`, statAmount) }}</span>
    </i18n-t>
    <ButtonComponent
      v-if="shareSupported"
      v-tippy="{content: $t('general.share'), aria: {content: null, expanded: false}}"
      :aria-label="$t('general.ariaShare', [$t(`allTimeStatus.${statKey}.ariaLabel`)])"
      :data-test-id="`all-time-status-item-share-button-${statKey}`"
      icon="shareVariant"
      variant="text"
      class="absolute left-[calc(50%+3rem)]"
      @click="shareOrCopy(`allTimeStatus.${statKey}.shareText`, [statAmount])"
    />
    <ButtonComponent
      v-else
      v-tippy="{content: $t('general.copy'), aria: {content: null, expanded: false}}"
      :aria-label="$t('general.ariaCopy', [$t(`allTimeStatus.${statKey}.ariaLabel`)])"
      :data-test-id="`all-time-status-item-copy-button-${statKey}`"
      icon="contentCopy"
      variant="text"
      class="absolute left-[calc(50%+3rem)]"
      @click="shareOrCopy(`allTimeStatus.${statKey}.shareText`, [statAmount])"
    />
  </div>
</template>
<style scoped>
.all-time-status__item {
  @apply label-like relative select-none;
  @apply flex flex-col items-center justify-center;
}
</style>
