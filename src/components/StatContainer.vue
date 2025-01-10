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
  <i18n-t scope="global" keypath="categoryStatus.centerLabel">
    <span>{{ $t(`allTimeStatus.${statKey}.topLabel`) }}</span>
    <span class="text-5xl">{{ statAmount }}</span>
    <span>{{ $t(`allTimeStatus.${statKey}.bottomLabel`) }}</span>
  </i18n-t>
  <ButtonComponent
    v-tippy="shareSupported ? t('allTimeStatus.share') : t('allTimeStatus.copy')"
    :data-test-id="
      shareSupported
        ? `stat-container-share-button-${statKey}`
        : `stat-container-copy-button-${statKey}`
    "
    style="left: calc(50% + 3rem)"
    variant="text"
    class="absolute"
    @click="shareOrCopy"
  >
    <IconComponent :icon="shareSupported ? 'shareVariant' : 'contentCopy'" />
  </ButtonComponent>
</template>
