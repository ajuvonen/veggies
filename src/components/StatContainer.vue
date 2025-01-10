<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import {APP_URL} from '@/utils/constants';

const props = defineProps<{
  statAmount: number;
  statKey: string;
}>();

const {t} = useI18n();

const shareSupported = !!navigator.share;

const shareOrCopy = async () =>
  shareSupported
    ? await navigator.share({
        text: t(`allTimeStatus.${props.statKey}.shareText`, [props.statAmount, APP_URL]),
        url: APP_URL,
      })
    : navigator.clipboard.writeText(
        t(`allTimeStatus.${props.statKey}.shareText`, [props.statAmount, APP_URL]),
      );
</script>
<template>
  <span>{{ $t(`allTimeStatus.${statKey}.topLabel`) }}</span>
  <div class="stat-container">
    <span>{{ statAmount }}</span>
    <ButtonComponent
      v-tippy="shareSupported ? t('allTimeStatus.share') : t('allTimeStatus.copy')"
      :aria-flowto="`stat-container-${statKey}`"
      variant="text"
      class="h-fit"
      @click="shareOrCopy"
    >
      <IconComponent :icon="shareSupported ? 'shareVariant' : 'contentCopy'" />
    </ButtonComponent>
  </div>
  <span :id="`stat-container-${statKey}`">{{ $t(`allTimeStatus.${statKey}.bottomLabel`) }}</span>
</template>
<style lang="scss" scoped>
.stat-container {
  @apply flex gap-2 items-center;
  @apply text-5xl;
}
</style>
