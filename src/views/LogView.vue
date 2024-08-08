<script setup lang="ts">
import {watch} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {useActivityStore} from '@/stores/activityStore';
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

watch(
  [currentVeggies, () => allVeggies.value.length],
  ([newCurrentVeggies, newTotalVeggies], [oldCurrentVeggies, oldTotalVeggies]) => {
    if (!oldTotalVeggies) {
      addToastMessage(t('toasts.firstVeggie'));
    }
  },
);
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
