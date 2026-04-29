<script lang="ts" setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useActivityStore} from '@/stores/activityStore';

const {
  over30Veggies,
  atMostVeggies,
  getWeekStarts,
  uniqueVeggies,
  completedChallenges,
  allVeggies,
  favorites,
} = storeToRefs(useActivityStore());

const sections = computed(() => ({
  totalWeeks: getWeekStarts.value.length,
  over30Veggies: over30Veggies.value,
  uniqueVeggies: uniqueVeggies.value.length,
  atMostVeggies: atMostVeggies.value,
  completedChallenges: completedChallenges.value,
}));
</script>
<template>
  <div class="all-time-status__container">
    <AllTimeStatusItem
      v-for="([key, value], index) in Object.entries(sections)"
      :key="key"
      :class="{'col-span-2': index === 4}"
      :statAmount="value"
      :statKey="key"
    />
  </div>
  <CategoryStatusChart
    :favorites="favorites"
    :veggies="allVeggies"
    alternateColorScheme
    topLabelKey="categoryStatus.topLabelTotal"
    bottomLabelKey="categoryStatus.bottomLabelTotal"
  />
</template>
<style scoped>
.all-time-status__container {
  @apply grid grid-cols-2 grid-rows-3;
  @apply text-center;
  row-gap: 1rem;
}
</style>
