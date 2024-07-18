<script lang="ts" setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {range, unique} from 'remeda';
import useDateTime from '@/hooks/dateTime';
import {useActivityStore} from '@/stores/activityStore';

const activitysStore = useActivityStore();
const {allVeggies, veggiesForWeek} = storeToRefs(activitysStore);
const {getTotalWeeks} = useDateTime();

const over30Veggies = computed(() => {
  const weeksOver30 = range(0, getTotalWeeks.value)
    .map((weekIndex) => veggiesForWeek.value(weekIndex).length > 30)
    .filter(Boolean);
  return Math.round((weeksOver30.length / getTotalWeeks.value) * 100);
});

const uniqueVeggies = computed(() => unique(allVeggies.value).length);

const atMostVeggies = computed(() =>
  Math.max(
    ...range(0, getTotalWeeks.value).map((weekIndex) => veggiesForWeek.value(weekIndex).length),
  ),
);
</script>
<template>
  <div class="chart-background status__container">
    <div class="status__item">
      <span class="text-xs">{{ $t('stats.grid1.topLabel') }}</span>
      <span class="text-6xl">{{ getTotalWeeks }}</span>
      <span class="text-xs">{{ $t('stats.grid1.bottomLabel') }}</span>
    </div>
    <div class="status__item">
      <span class="text-xs">{{ $t('stats.grid2.topLabel') }}</span>
      <span class="text-6xl">{{ over30Veggies }}<span class="text-xs">%</span></span>
      <span class="text-xs">{{ $t('stats.grid2.bottomLabel') }}</span>
    </div>
    <div class="status__item">
      <span class="text-xs">{{ $t('stats.grid3.topLabel') }}</span>
      <span class="text-6xl">{{ uniqueVeggies }}</span>
      <span class="text-xs">{{ $t('stats.grid3.bottomLabel') }}</span>
    </div>
    <div class="status__item">
      <span class="text-xs">{{ $t('stats.grid4.topLabel') }}</span>
      <span class="text-6xl">{{ atMostVeggies }}</span>
      <span class="text-xs">{{ $t('stats.grid4.bottomLabel') }}</span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.status__container {
  @apply grid grid-cols-2 grid-rows-2 gap-4;
  @apply uppercase;
}

.status__item {
  @apply flex flex-col items-center justify-center;
}
</style>
