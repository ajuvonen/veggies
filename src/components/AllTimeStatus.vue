<script lang="ts" setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useActivityStore} from '@/stores/activityStore';
import StatContainer from '@/components/StatContainer.vue';

const activitysStore = useActivityStore();
const {over30Veggies, atMostVeggies, getWeekStarts, uniqueVeggies, completedChallenges} =
  storeToRefs(activitysStore);

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
    <div
      v-for="([key, value], index) in Object.entries(sections)"
      :key="key"
      :class="{'col-span-2': index === 4}"
      :data-test-id="`all-time-status-${key}`"
      class="all-time-status__item"
    >
      <StatContainer :statAmount="value" :statKey="key" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.all-time-status__container {
  @apply grid grid-cols-2 grid-rows-3;
  @apply text-center;
  row-gap: 1rem;
}

.all-time-status__item {
  @apply label-like relative;
  @apply flex flex-col items-center justify-center;
}
</style>
