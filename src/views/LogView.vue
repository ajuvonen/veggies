<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useActivityStore} from '@/stores/activityStore';
import VeggieSearch from '@/components/VeggieSearch.vue';
import CategoryStatus from '@/components/CategoryStatus.vue';
import TagsComponent from '@/components/TagsComponent.vue';
import FrontPageAnimation from '@/components/FrontPageAnimation.vue';

const activityStore = useActivityStore();
const {favorites, currentVeggies} = storeToRefs(activityStore);
const {toggleVeggie} = activityStore;
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
  @apply max-h-[350px];
}
</style>
