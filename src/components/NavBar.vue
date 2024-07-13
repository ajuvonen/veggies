<script setup lang="ts">
import {RouterLink} from 'vue-router';
</script>
<template>
  <nav class="nav">
    <RouterLink to="/log" class="nav__link nav__link--log" :aria-label="$t('views.log')">{{
      $t('general.appTitle')
    }}</RouterLink>
    <div class="flex gap-2">
      <RouterLink class="nav__link" to="/settings" :aria-label="$t('views.settings')">
        <IconComponent icon="cog" size="6vw" class="nav__link-icon" />
      </RouterLink>
    </div>
  </nav>
</template>
<style scoped lang="scss">
.nav {
  @apply w-full;
  @apply flex justify-between items-center;
}

.nav__link {
  @apply rounded-full;
  &:hover {
    @apply text-slate-200 fill-slate-200;
  }
}

.nav__link--log {
  font-family: 'Bungee Shade', system-ui;
  font-size: 6vw;
  @apply uppercase sm:text-4xl rounded-md;
}

.nav__link-icon {
  @apply max-h-9 min-h-5 max-w-9 min-w-5;
}
</style>
