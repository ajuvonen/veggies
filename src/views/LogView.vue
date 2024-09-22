<script setup lang="ts">
import {provide, ref, watch} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {isIncludedIn, omitBy} from 'remeda';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import {ALL_VEGGIES, KEYS} from '@/utils/constants';
import {AchievementLevel, type Achievements} from '@/utils/types';
import VeggieSearch from '@/components/VeggieSearch.vue';
import CategoryStatus from '@/components/CategoryStatus.vue';
import TagsComponent from '@/components/TagsComponent.vue';
import FrontPageAnimation from '@/components/FrontPageAnimation.vue';
import ModalDialog from '@/components/ModalDialog.vue';
import AchievementBadge from '@/components/AchievementBadge.vue';

const {t} = useI18n();

const activityStore = useActivityStore();
const {favorites, currentVeggies, currentChallenge, allVeggies, uniqueVeggies} =
  storeToRefs(activityStore);
const {toggleVeggie} = activityStore;
const {achievements} = storeToRefs(useAppStateStore());

const {addToastMessage} = useAppStateStore();

const newAchievements = ref({} as Partial<Achievements>);
const dialogOpen = ref(false);

watch(currentVeggies, (newCurrentVeggies, oldCurrentVeggies) => {
  const cheer = t(`cheers[${Math.floor(Math.random() * 10)}]`);
  if (allVeggies.value.length === 1 && oldCurrentVeggies.length === 0) {
    addToastMessage(t('toasts.firstVeggie', [cheer]));
  }

  if (allVeggies.value.length && allVeggies.value.length % 100 === 0) {
    addToastMessage(t('toasts.hundreds', [allVeggies.value.length, cheer]));
  }

  if (
    isIncludedIn(currentChallenge.value, newCurrentVeggies) &&
    !isIncludedIn(currentChallenge.value, oldCurrentVeggies)
  ) {
    addToastMessage(t('toasts.challengeCompleted', [cheer]));
  }

  if (Math.random() <= 0.05 && allVeggies.value.length) {
    addToastMessage(
      t('toasts.uniqueVeggies', [uniqueVeggies.value.length, ALL_VEGGIES.length, cheer]),
    );
  }
});

watch(achievements, (newValue, oldValue) => {
  newAchievements.value = omitBy(
    newValue,
    (value, key) => value === AchievementLevel.NoAchievement || oldValue[key] === value,
  );
  if (Object.keys(newAchievements.value).length) {
    dialogOpen.value = true;
  }
});

provide(KEYS.challenge, currentChallenge);
</script>
<template>
  <VeggieSearch v-model="currentVeggies" />
  <CategoryStatus class="log-view__chart" v-if="currentVeggies.length" :veggies="currentVeggies" />
  <FrontPageAnimation class="log-view__chart" v-else />
  <TagsComponent
    :veggies="favorites"
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
.log-view__chart {
  max-height: min(100vw - 2rem, 400px);
}

.log-view__achievement-container {
  @apply flex-container gap-4 flex-col;
  @apply text-sm;
}

.log-view__achievement-row {
  @apply flex-container flex-col;
}
</style>
