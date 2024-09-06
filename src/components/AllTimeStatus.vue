<script lang="ts" setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useActivityStore} from '@/stores/activityStore';

const activitysStore = useActivityStore();
const {veggiesForWeek, getWeekStarts, getTotalWeeks, uniqueVeggies} = storeToRefs(activitysStore);
const over30Veggies = computed(
  () =>
    getWeekStarts.value.filter((weekStart) => veggiesForWeek.value(weekStart).length >= 30).length,
);

const atMostVeggies = computed(() =>
  Math.max(...getWeekStarts.value.map((weekStart) => veggiesForWeek.value(weekStart).length)),
);
</script>
<template>
  <div class="chart-background status__container">
    <div class="status__item">
      <span>{{ $t('stats.grid1.topLabel') }}</span>
      <span class="text-5xl">{{ getTotalWeeks }}</span>
      <span>{{ $t('stats.grid1.bottomLabel') }}</span>
    </div>
    <div class="status__item">
      <span>{{ $t('stats.grid2.topLabel') }}</span>
      <span class="text-5xl">{{ over30Veggies }}</span>
      <span>{{ $t('stats.grid2.bottomLabel') }}</span>
    </div>
    <div class="status__item">
      <span>{{ $t('stats.grid3.topLabel') }}</span>
      <span class="text-5xl">{{ uniqueVeggies.length }}</span>
      <span>{{ $t('stats.grid3.bottomLabel') }}</span>
    </div>
    <div class="status__item">
      <span>{{ $t('stats.grid4.topLabel') }}</span>
      <span class="text-5xl">{{ atMostVeggies }}</span>
      <span>{{ $t('stats.grid4.bottomLabel') }}</span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.status__container {
  @apply grid grid-cols-2 grid-rows-2 gap-4;
  @apply uppercase text-xs text-center;
}

.status__item {
  @apply flex flex-col items-center justify-center;
}
</style>
