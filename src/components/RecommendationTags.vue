<script lang="ts" setup>
import {storeToRefs} from 'pinia';
import {useActivityStore} from '@/stores/activityStore';
import ButtonComponent from './ButtonComponent.vue';

const activityStore = useActivityStore();
const {favorites} = storeToRefs(activityStore);
const {toggleVeggie} = activityStore;
</script>

<template>
  <div class="flex flex-wrap justify-center gap-2 max-w-lg">
    <ButtonComponent
      v-for="veggie in favorites"
      :key="veggie"
      variant="tag"
      @click="toggleVeggie(veggie)"
      >{{ $t(`veggies.${veggie}`) }}</ButtonComponent
    >
  </div>
</template>
