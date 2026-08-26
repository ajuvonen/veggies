<script setup lang="ts">
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useRoute} from 'vue-router';
import {useI18n} from 'vue-i18n';
import {useAppStateStore} from '@/stores/appStateStore';
import {LOCALES} from '@/utils/constants';

const route = useRoute();
const {t} = useI18n();
const {settings} = storeToRefs(useAppStateStore());

const availableLocales = computed(() =>
  LOCALES.filter((availableLocale) => availableLocale !== settings.value.locale),
);

const isHome = computed(() => route.name === 'home');
const backRoute = computed(() => (settings.value.startDate ? 'log' : 'home'));

const headerTitle = computed(() => {
  const routeName = route.name?.toString();
  return {
    name: !routeName || routeName === 'log' ? t('general.appTitle') : t(`views.${routeName}`),
    ariaLabel: !routeName ? t('general.appTitle') : t(`views.${routeName}`),
  };
});
</script>
<template>
  <nav class="navbar">
    <h1 v-if="!isHome" :aria-label="headerTitle.ariaLabel" class="navbar__header">
      {{ headerTitle.name }}
    </h1>
    <div class="flex-container justify-end w-full">
      <RouterLink
        v-if="!['log', 'home'].includes(route.name as string)"
        v-tippy="$t(`views.${backRoute}`)"
        :aria-label="$t(`views.${backRoute}`)"
        :to="{name: backRoute}"
        data-test-id="navbar-back-link"
      >
        <IconComponent icon="arrowLeft" size="6vw" class="navbar__link-icon" />
      </RouterLink>
      <RouterLink
        v-if="settings.startDate"
        v-tippy="$t('views.stats')"
        :aria-label="$t('views.stats')"
        to="/stats"
        data-test-id="navbar-stats-link"
      >
        <IconComponent icon="chart" size="6vw" class="navbar__link-icon" />
      </RouterLink>
      <RouterLink
        v-if="settings.startDate"
        v-tippy="$t('views.settings')"
        :aria-label="$t('views.settings')"
        to="/settings"
        data-test-id="navbar-settings-link"
      >
        <IconComponent icon="cog" size="6vw" class="navbar__link-icon" />
      </RouterLink>
      <IconComponent v-if="isHome" icon="earth" />
      <template v-if="isHome">
        <ButtonComponent
          v-for="availableLocale in availableLocales"
          :key="availableLocale"
          :aria-label="$t('home.changeLocale', [$t(`locales.${availableLocale}`)])"
          :data-test-id="`home-locale-button-${availableLocale}`"
          color="transparent"
          @click="settings.locale = availableLocale"
          >{{ availableLocale }}</ButtonComponent
        >
      </template>
    </div>
  </nav>
</template>
<style scoped>
.navbar {
  @apply w-full;
  @apply flex justify-between items-center;
}

.navbar__header {
  font-family: 'Bungee Shade', system-ui;
  font-size: 5.8vw;
  line-height: 2.5rem;
  @apply whitespace-nowrap uppercase sm:text-4xl rounded-md select-none;
}

.navbar__link-icon {
  @apply m-1 max-h-7 min-h-5 max-w-7 min-w-5;
}
</style>
