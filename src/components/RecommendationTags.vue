<script lang="ts" setup>
import {storeToRefs} from 'pinia';
import {useActivityStore} from '@/stores/activityStore';
import ButtonComponent from './ButtonComponent.vue';

const activityStore = useActivityStore();
const {getFavorites} = storeToRefs(activityStore);
const {toggleIngredient} = activityStore;
</script>

<template>
  <div class="flex flex-wrap justify-center gap-2">
    <ButtonComponent
      v-for="[key, category] in getFavorites"
      :key="key"
      variant="tag"
      @click="toggleIngredient(key, category)"
      >{{ $t(`ingredients.${key}`) }}</ButtonComponent
    >
  </div>
</template>
