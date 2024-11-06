<script setup lang="ts">
import {provide, ref, watch} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {difference, first, omitBy} from 'remeda';
import confetti from 'canvas-confetti';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import {ALL_VEGGIES, KEYS} from '@/utils/constants';
import {AchievementLevel, type Achievements} from '@/utils/types';
import VeggieSearch from '@/components/VeggieSearch.vue';
import CategoryStatusChart from '@/components/charts/CategoryStatusChart.vue';
import TagsComponent from '@/components/TagsComponent.vue';
import FrontPageAnimation from '@/components/FrontPageAnimation.vue';
import ModalDialog from '@/components/ModalDialog.vue';
import AchievementBadge from '@/components/AchievementBadge.vue';

const {t, tm} = useI18n();

const activityStore = useActivityStore();
const {suggestions, currentVeggies, currentChallenge, allVeggies, uniqueVeggies} =
  storeToRefs(activityStore);
const {toggleVeggie} = activityStore;
const {achievements} = storeToRefs(useAppStateStore());

const {addToastMessage} = useAppStateStore();

const newAchievements = ref({} as Partial<Achievements>);
const dialogOpen = ref(false);

const getCheer = () => t(`cheers[${Math.floor(Math.random() * 10)}]`);

watch(currentVeggies, (newCurrentVeggies, oldCurrentVeggies) => {
  const addedVeggie = first(difference(newCurrentVeggies, oldCurrentVeggies));
  if (addedVeggie) {
    if (allVeggies.value.length === 1) {
      addToastMessage(t('toasts.firstVeggie', [getCheer()]));
    } else if (addedVeggie === currentChallenge.value) {
      addToastMessage(t('toasts.challengeCompleted', [getCheer()]));
    } else if (allVeggies.value.length % 100 === 0) {
      addToastMessage(t('toasts.totalVeggies', [allVeggies.value.length, getCheer()]));
    } else if (Math.random() <= 0.35) {
      const facts = [
        ...Object.values<string>(tm(`facts.${addedVeggie}`)),
        t('toasts.uniqueVeggies', [uniqueVeggies.value.length, ALL_VEGGIES.length, getCheer()]),
        t('toasts.totalVeggies', [allVeggies.value.length, getCheer()]),
      ];
      addToastMessage(facts[Math.floor(Math.random() * facts.length)]);
    }
  }
});

watch(achievements, (newValue, oldValue) => {
  newAchievements.value = omitBy(
    newValue,
    (value, key) => value === AchievementLevel.NoAchievement || oldValue[key] >= value,
  );
  if (Object.keys(newAchievements.value).length) {
    dialogOpen.value = true;
    confetti({
      disableForReducedMotion: true,
      particleCount: 150,
      spread: 70,
      origin: {x: 0.5, y: 0.7},
    });
  }
});

provide(KEYS.challenge, currentChallenge);
</script>
<template>
  <h1 class="sr-only">{{ $t('views.log') }}</h1>
  <VeggieSearch v-model="currentVeggies" />
  <CategoryStatusChart v-if="currentVeggies.length" :veggies="currentVeggies" />
  <FrontPageAnimation class="log-view__chart" v-else />
  <TagsComponent
    :veggies="suggestions"
    :variant="['tag', 'primary']"
    ariaKey="general.clickToAdd"
    icon="plus"
    @click="(veggie) => toggleVeggie(veggie)"
  />
  <ModalDialog v-model="dialogOpen" :title="$t('achievements.newAchievements')">
    <template #content>
      <ul class="log-view__achievement-container">
        <li v-for="(value, key) in newAchievements" :key="key" class="log-view__achievement-row">
          <AchievementBadge active :achievement="key" :level="value!" />
          <p class="text-center">{{ t(`achievements.${key}.${value}`) }}</p>
        </li>
      </ul>
    </template>
  </ModalDialog>
</template>
<style lang="scss">
.log-view__achievement-container {
  @apply flex-container gap-4 flex-col;
  @apply text-sm;
}

.log-view__achievement-row {
  @apply flex-container flex-col;
}
</style>
