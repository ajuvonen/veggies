<script setup lang="ts">
import {watch} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import {ALL_VEGGIES} from '@/utils/constants';
import VeggieSearch from '@/components/VeggieSearch.vue';
import CategoryStatus from '@/components/CategoryStatus.vue';
import TagsComponent from '@/components/TagsComponent.vue';
import FrontPageAnimation from '@/components/FrontPageAnimation.vue';

const {t} = useI18n();

const activityStore = useActivityStore();
const {favorites, currentVeggies, allVeggies, uniqueVeggies} = storeToRefs(activityStore);
const {toggleVeggie} = activityStore;

const {addToastMessage} = useAppStateStore();

watch(allVeggies, (newAllVeggies, oldAllVeggies) => {
  const cheer = t(`cheers[${Math.floor(Math.random() * 10)}]`);
  if (!oldAllVeggies.length) {
    addToastMessage(t('toasts.firstVeggie', [cheer]));
  } else if (newAllVeggies.length % 100 === 0) {
    addToastMessage(t('toasts.hundreds', [newAllVeggies.length, cheer]));
  } else if (currentVeggies.value.length === 30) {
    addToastMessage(t('toasts.thirtyVeggies', [cheer]));
  } else if (Math.random() <= 0.05) {
    addToastMessage(
      t('toasts.uniqueVeggies', [uniqueVeggies.value.length, ALL_VEGGIES.length, cheer]),
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
