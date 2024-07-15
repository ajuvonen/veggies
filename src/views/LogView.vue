<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useActivityStore} from '@/stores/activityStore';
import VeggieSearch from '@/components/VeggieSearch.vue';
import WeekStatus from '@/components/WeekStatus.vue';
import TagsComponent from '@/components/TagsComponent.vue';

const activityStore = useActivityStore();
const {favorites} = storeToRefs(activityStore);
const {toggleVeggie} = activityStore;
</script>
<template>
  <WeekStatus />
  <VeggieSearch @toggle="toggleVeggie" />
  <TagsComponent
    :items="favorites"
    :variant="['tag', 'primary']"
    @click="(veggie) => toggleVeggie(veggie)"
  >
    <template #item="{item}">
      <span
        :aria-label="$t(`general.clickToAdd`, [$t(`veggies.${item}`)])"
        :title="$t(`general.clickToAdd`, [$t(`veggies.${item}`)])"
        >{{ $t(`veggies.${item}`) }}</span
      >
    </template>
  </TagsComponent>
</template>
