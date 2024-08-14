<script setup lang="ts">
import {watch} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {unique} from 'remeda';
import {useActivityStore} from '@/stores/activityStore';
import {ALL_VEGGIES} from '@/utils/constants';
import VeggieSearch from '@/components/VeggieSearch.vue';
import CategoryStatus from '@/components/CategoryStatus.vue';
import TagsComponent from '@/components/TagsComponent.vue';
import FrontPageAnimation from '@/components/FrontPageAnimation.vue';
import {useAppStateStore} from '@/stores/appStateStore';

const {t} = useI18n();

const activityStore = useActivityStore();
const {favorites, currentVeggies, allVeggies} = storeToRefs(activityStore);
const {toggleVeggie} = activityStore;

const {addToastMessage} = useAppStateStore();

const fivePercentChance = () => Math.random() <= 0.05;

watch([currentVeggies, allVeggies], ([newCurrentVeggies, newAllVeggies], [, oldAllVeggies]) => {
  const cheer = t(`cheers[${Math.floor(Math.random() * 10)}]`);
  if (!oldAllVeggies.length) {
    addToastMessage(t('toasts.firstVeggie', [cheer]));
  } else if (newAllVeggies.length % 100 === 0) {
    addToastMessage(t('toasts.hundreds', [newAllVeggies.length, cheer]));
  } else if (newCurrentVeggies.length === 30) {
    addToastMessage(t('toasts.thirtyVeggies', [cheer]));
  } else if (fivePercentChance()) {
    addToastMessage(
      t('toasts.uniqueVeggies', [unique(newAllVeggies).length, ALL_VEGGIES.length, cheer]),
    );
  }
});
</script>
<template>
  <CategoryStatus class="log-view__chart" v-if="currentVeggies.length" :veggies="currentVeggies" />
  <FrontPageAnimation class="log-view__chart" v-else />
  <VeggieSearch :selected="currentVeggies" @toggle="toggleVeggie" />
  <TagsComponent
    :veggies="favorites"
    :variant="['tag', 'primary']"
    icon="plus"
    @click="(veggie) => toggleVeggie(veggie)"
  />
</template>
<style lang="scss">
.log-view__chart {
  max-height: min(100vw - 2rem, 400px);
}
</style>
