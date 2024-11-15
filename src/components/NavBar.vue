<script setup lang="ts">
import {computed} from 'vue';
import {RouterLink, useRoute} from 'vue-router';
import HomeLocaleChanger from '@/components/HomeLocaleChanger.vue';
defineProps<{
  showStats: boolean;
}>();

const route = useRoute();

const isHome = computed(() => route.name === 'home');
</script>
<template>
  <nav :class="{'navbar--home': isHome}" class="navbar">
    <RouterLink
      v-if="!isHome"
      :aria-label="$t('views.log')"
      to="/log"
      class="nav__link nav__link--log"
      data-test-id="navbar-link-log"
      >{{ $t('general.appTitle') }}</RouterLink
    >
    <div v-if="!isHome" class="flex-container">
      <RouterLink
        v-if="showStats"
        :title="$t('views.stats')"
        :aria-label="$t('views.stats')"
        to="/stats"
        class="nav__link"
        data-test-id="navbar-link-stats"
      >
        <IconComponent icon="chart" size="6vw" class="nav__link-icon" />
      </RouterLink>
      <RouterLink
        :title="$t('views.settings')"
        :aria-label="$t('views.settings')"
        to="/settings"
        class="nav__link"
        data-test-id="navbar-link-settings"
      >
        <IconComponent icon="cog" size="6vw" class="nav__link-icon" />
      </RouterLink>
    </div>
    <HomeLocaleChanger v-else />
  </nav>
</template>
<style scoped lang="scss">
.navbar {
  @apply w-full;
  @apply flex justify-between items-center;

  &--home {
    @apply justify-end;
  }
}

.nav__link {
  @apply rounded-md leading-[1.2];
  @apply fill-slate-50;
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
  @apply max-h-7 min-h-5 max-w-7 min-w-5;
}
</style>
