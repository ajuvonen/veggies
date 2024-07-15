<script lang="ts" setup>
import {storeToRefs} from 'pinia';
import {useActivityStore} from '@/stores/activityStore';
import TagsComponent from '@/components/TagsComponent.vue';

const activityStore = useActivityStore();
const {currentveggies} = storeToRefs(activityStore);
const {toggleVeggie} = activityStore;
</script>
<template>
  <h1>{{ $t('views.stats') }}</h1>
  <h2>{{ $t('stats.thisWeeksVeggies') }}</h2>
  <TagsComponent :items="currentveggies" :variant="['tag', 'danger']" @click="toggleVeggie">
    <template #item="{item}">
      <IconComponent icon="minus" />
      <span
        :aria-label="$t(`general.clickToRemove`, [$t(`veggies.${item}`)])"
        :title="$t(`general.clickToRemove`, [$t(`veggies.${item}`)])"
        >{{ $t(`veggies.${item}`) }}</span
      >
    </template>
  </TagsComponent>
</template>
