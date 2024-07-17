<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useActivityStore} from '@/stores/activityStore';
import VeggieSearch from '@/components/VeggieSearch.vue';
import WeekStatus from '@/components/WeekStatus.vue';
import TagsComponent from '@/components/TagsComponent.vue';
import {useI18n} from 'vue-i18n';

const {t, locale} = useI18n();

const activityStore = useActivityStore();
const {favorites, currentVeggies} = storeToRefs(activityStore);
const {toggleVeggie} = activityStore;
</script>
<template>
  <WeekStatus />
  <VeggieSearch :selected="currentVeggies" @toggle="toggleVeggie" />
  <TagsComponent
    :veggies="favorites"
    :variant="['tag', 'primary']"
    icon="plus"
    @click="(veggie) => toggleVeggie(veggie)"
  />
</template>
