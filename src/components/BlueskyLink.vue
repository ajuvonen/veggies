<script lang="ts" setup>
import {BLUESKY_URL} from '@/utils/constants';
</script>
<template>
  <a class="bluesky-link" :href="BLUESKY_URL" target="_blank" noreferrer noopener>
    <IconComponent icon="bluesky" />
    {{ $t('general.follow') }}
  </a>
</template>
<style lang="scss" scoped>
.bluesky-link {
  @apply uppercase text-xs !w-fit;
  @apply flex-container items-center;
}
</style>
