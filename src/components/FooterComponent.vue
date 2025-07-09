<script lang="ts" setup>
import {computed} from 'vue';
import {BLUESKY_URL, PLAY_STORE_URL} from '@/utils/constants';

const showPlayStoreLink = computed(
  () => navigator.userAgent.includes('Android') && !navigator.userAgent.includes('wv'),
);
</script>
<template>
  <footer>
    <a
      class="flex-container items-center"
      :href="BLUESKY_URL"
      target="_blank"
      noreferrer
      noopener
      data-test-id="bluesky-link"
    >
      <IconComponent icon="bluesky" />
      {{ $t('general.follow') }}
    </a>
    <a
      v-if="showPlayStoreLink"
      class="flex-container items-center"
      :href="PLAY_STORE_URL"
      target="_blank"
      noreferrer
      noopener
      data-test-id="play-store-link"
    >
      <IconComponent icon="googlePlay" />
      {{ $t('general.playStore') }}
    </a>
  </footer>
</template>
<style scoped>
footer {
  @apply uppercase text-xs;
  @apply flex-container gap-4 justify-center;
}
</style>
