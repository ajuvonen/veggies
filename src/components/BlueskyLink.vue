<script lang="ts" setup>
import {BLUESKY_URL} from '@/utils/constants';
</script>
<template>
  <footer>
    <a class="flex-container" :href="BLUESKY_URL" target="_blank" noreferrer noopener>
      <IconComponent icon="bluesky" />
      {{ $t('general.follow') }}
    </a>
  </footer>
</template>
<style scoped>
footer {
  @apply uppercase text-xs;
  @apply flex justify-center;
}
</style>
