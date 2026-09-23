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
    <h1
      v-if="!isHome"
      :class="{'navbar__header--decorative': route.name === 'log'}"
      :aria-label="headerTitle.ariaLabel"
      class="navbar__header"
    >
      {{ headerTitle.name }}
    </h1>
    <div class="flex gap-4 justify-end w-full">
      <RouterLink
        v-if="!['log', 'home'].includes(route.name as string)"
        v-tippy="$t(`views.${backRoute}`)"
        :aria-label="$t(`views.${backRoute}`)"
        :to="{name: backRoute}"
        data-test-id="navbar-back-link"
      >
        <IconComponent icon="arrowLeft" />
      </RouterLink>
      <RouterLink
        v-if="!isHome && settings.startDate"
        v-tippy="$t('views.stats')"
        :aria-label="$t('views.stats')"
        to="/stats"
        data-test-id="navbar-stats-link"
      >
        <IconComponent icon="chart" />
      </RouterLink>
      <RouterLink
        v-if="!isHome && settings.startDate"
        v-tippy="$t('views.settings')"
        :aria-label="$t('views.settings')"
        to="/settings"
        data-test-id="navbar-settings-link"
      >
        <IconComponent icon="cog" />
      </RouterLink>
      <template v-if="isHome">
        <IconComponent icon="earth" />
        <ButtonComponent
          v-for="availableLocale in availableLocales"
          :key="availableLocale"
          :aria-label="$t('home.changeLocale', [$t(`locales.${availableLocale}`)])"
          :data-test-id="`home-locale-button-${availableLocale}`"
          color="transparent"
          @click="settings.locale = availableLocale"
          >{{ availableLocale === 'el' ? 'ελ' : availableLocale }}</ButtonComponent
        >
      </template>
    </div>
  </nav>
</template>
<style scoped>
@reference '@/assets/main.css';

.navbar {
  @apply w-full;
  @apply flex gap-4 items-center;
}

.navbar__header {
  @apply whitespace-nowrap tracking-wider uppercase text-xl rounded-md select-none;
}

.navbar__header--decorative {
  @apply font-branding;
  font-size: clamp(1.2rem, 4vw, 1.7rem);
}
</style>
