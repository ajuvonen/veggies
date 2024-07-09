<script setup lang="ts">
import {RouterLink} from 'vue-router';
import IconComponent from '@/components/IconComponent.vue';
</script>
<template>
  <nav class="nav">
    <RouterLink to="/log" class="nav__link nav__link--log">{{ $t('app-title') }}</RouterLink>
    <div class="flex gap-2">
      <RouterLink class="nav__link" to="/settings">
        <IconComponent icon="cog" />
      </RouterLink>
    </div>
  </nav>
</template>
<style scoped lang="scss">
.nav {
  @apply w-full p-4 top-0 fixed;
  @apply flex justify-between items-center;
}

.nav__link {
  @apply fill-white;
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
</style>
