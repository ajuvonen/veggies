<script setup lang="ts">
import {ref, watch} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {omitBy} from 'remeda';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import {ALL_VEGGIES} from '@/utils/constants';
import type {Achievements} from '@/utils/types';
import VeggieSearch from '@/components/VeggieSearch.vue';
import CategoryStatus from '@/components/CategoryStatus.vue';
import TagsComponent from '@/components/TagsComponent.vue';
import FrontPageAnimation from '@/components/FrontPageAnimation.vue';
import ModalDialog from '@/components/ModalDialog.vue';
import AchievementBadge from '@/components/AchievementBadge.vue';

const {t} = useI18n();

const activityStore = useActivityStore();
const {favorites, currentVeggies, allVeggies, uniqueVeggies} = storeToRefs(activityStore);
const {toggleVeggie} = activityStore;
const {achievements} = storeToRefs(useAppStateStore());

const {addToastMessage} = useAppStateStore();

const newAchievements = ref({} as Partial<Achievements>);
const dialogOpen = ref(false);

watch(allVeggies, (newAllVeggies, oldAllVeggies) => {
  const cheer = t(`cheers[${Math.floor(Math.random() * 10)}]`);
  if (!oldAllVeggies.length) {
    addToastMessage(t('toasts.firstVeggie', [cheer]));
  } else if (newAllVeggies.length && newAllVeggies.length % 100 === 0) {
    addToastMessage(t('toasts.hundreds', [newAllVeggies.length, cheer]));
  } else if (currentVeggies.value.length === 30) {
    addToastMessage(t('toasts.thirtyVeggies', [cheer]));
  } else if (Math.random() <= 0.05) {
    addToastMessage(
      t('toasts.uniqueVeggies', [uniqueVeggies.value.length, ALL_VEGGIES.length, cheer]),
    );
  }
});

watch(achievements, (newValue, oldValue) => {
  newAchievements.value = omitBy(newValue, (value, key) => oldValue[key] === value);
  dialogOpen.value = true;
});
</script>
<template>
  <CategoryStatus class="log-view__chart" v-if="currentVeggies.length" :veggies="currentVeggies" />
  <FrontPageAnimation class="log-view__chart" v-else />
  <VeggieSearch v-model="currentVeggies" />
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
