<script lang="ts" setup></script>
<template>
  <a
    class="bluesky-link"
    href="https://bsky.app/profile/eatyourveggies.app"
    target="_blank"
    noreferrer
    noopener
  >
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
