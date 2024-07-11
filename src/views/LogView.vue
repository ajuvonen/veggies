<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useActivityStore} from '@/stores/activityStore';
import VeggieSearch from '@/components/VeggieSearch.vue';
import WeekStatus from '@/components/WeekStatus.vue';
import RecommendationTags from '@/components/RecommendationTags.vue';

const activityStore = useActivityStore();
const {favorites} = storeToRefs(activityStore);
const {toggleVeggie} = activityStore;
</script>
<template>
  <WeekStatus />
  <VeggieSearch @toggle="toggleVeggie" />
  <RecommendationTags :favorites="favorites" @toggle="toggleVeggie" />
</template>
