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
      class="navbar__log-link"
      data-test-id="navbar-link-log"
      >{{ $t('general.appTitle') }}</RouterLink
    >
    <div v-if="!isHome" class="flex-container">
      <RouterLink
        v-if="showStats"
        v-tippy="$t('views.stats')"
        to="/stats"
        data-test-id="navbar-link-stats"
      >
        <IconComponent icon="chart" size="6vw" class="navbar__link-icon" />
      </RouterLink>
      <RouterLink v-tippy="$t('views.settings')" to="/settings" data-test-id="navbar-link-settings">
        <IconComponent icon="cog" size="6vw" class="navbar__link-icon" />
      </RouterLink>
    </div>
    <HomeLocaleChanger v-else />
  </nav>
</template>
<style scoped>
.navbar {
  @apply w-full;
  @apply flex justify-between items-center;
}

.navbar--home {
  @apply justify-end;
}

.navbar__log-link {
  font-family: 'Bungee Shade', system-ui;
  font-size: 6vw;
  @apply uppercase sm:text-4xl rounded-md;
}

.navbar__link-icon {
  @apply max-h-7 min-h-5 max-w-7 min-w-5;
}
</style>
