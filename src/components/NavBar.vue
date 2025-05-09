<script setup lang="ts">
import {computed} from 'vue';
import {RouterLink, useRoute} from 'vue-router';
import {useI18n} from 'vue-i18n';
import HomeLocaleChanger from '@/components/HomeLocaleChanger.vue';
defineProps<{
  showStats: boolean;
}>();

const route = useRoute();

const {t} = useI18n();

const isHome = computed(() => route.name === 'home');

const routeName = computed(() =>
  route.name === 'log' ? t('general.appTitle') : t(`views.${route.name?.toString()}`),
);
</script>
<template>
  <nav :class="{'navbar--home': isHome}" class="navbar">
    <h1 v-if="!isHome" :aria-label="$t(`views.${route.name?.toString()}`)" class="navbar__header">
      {{ routeName }}
    </h1>
    <div v-if="!isHome" class="flex-container">
      <RouterLink
        v-if="route.name !== 'log'"
        v-tippy="$t('views.log')"
        :aria-label="$t('views.log')"
        to="/log"
        class="navbar__log-link"
        data-test-id="navbar-log-link"
      >
        <IconComponent icon="chevronLeftCircle" size="6vw" class="navbar__link-icon" />
      </RouterLink>
      <RouterLink
        v-if="showStats"
        v-tippy="$t('views.stats')"
        :aria-label="$t('views.stats')"
        to="/stats"
        data-test-id="navbar-stats-link"
      >
        <IconComponent icon="chart" size="6vw" class="navbar__link-icon" />
      </RouterLink>
      <RouterLink
        v-tippy="$t('views.settings')"
        :aria-label="$t('views.settings')"
        to="/settings"
        data-test-id="navbar-settings-link"
      >
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

.navbar__header {
  font-family: 'Bungee Shade', system-ui;
  font-size: 6vw;
  @apply uppercase sm:text-4xl rounded-md;
}

.navbar__link-icon {
  @apply max-h-7 min-h-5 max-w-7 min-w-5;
}
</style>
