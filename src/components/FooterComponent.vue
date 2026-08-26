<script lang="ts" setup>
import {BLUESKY_URL, PLAY_STORE_URL} from '@/utils/constants';

withDefaults(
  defineProps<{
    showPrivacyPolicyLink?: boolean;
  }>(),
  {
    showPrivacyPolicyLink: false,
  },
);

const showPlayStoreLink =
  navigator.userAgent.includes('Android') &&
  !window.matchMedia('(display-mode: standalone)').matches;
</script>
<template>
  <footer>
    <div class="flex gap-4 justify-center">
      <a
        class="flex-container items-center"
        :href="BLUESKY_URL"
        target="_blank"
        rel="noopener noreferrer"
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
        rel="noopener noreferrer"
        data-test-id="play-store-link"
      >
        <IconComponent icon="googlePlay" />
        {{ $t('general.playStore') }}
      </a>
    </div>
    <div v-if="showPrivacyPolicyLink" class="flex justify-center">
      <RouterLink to="/privacy" class="self-center" data-test-id="privacy-policy-link">
        {{ $t('views.privacy') }}
      </RouterLink>
    </div>
  </footer>
</template>
<style scoped>
footer {
  @apply flex-container flex-col;
  @apply uppercase text-xs;
}
</style>
