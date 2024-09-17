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
    <i18n-t
      keypath="categoryStatus.centerLabel"
      tag="div"
      class="status__item"
      data-test-id="all-time-weeks"
    >
      <span>{{ $t('stats.grid1.topLabel') }}</span>
      <span class="text-5xl">{{ getTotalWeeks }}</span>
      <span>{{ $t('stats.grid1.bottomLabel') }}</span>
    </i18n-t>
    <i18n-t
      keypath="categoryStatus.centerLabel"
      tag="div"
      class="status__item"
      data-test-id="all-time-over-30"
    >
      <span>{{ $t('stats.grid2.topLabel') }}</span>
      <span class="text-5xl">{{ over30Veggies }}</span>
      <span>{{ $t('stats.grid2.bottomLabel') }}</span>
    </i18n-t>
    <i18n-t
      keypath="categoryStatus.centerLabel"
      tag="div"
      class="status__item"
      data-test-id="all-time-unique"
    >
      <span>{{ $t('stats.grid3.topLabel') }}</span>
      <span class="text-5xl">{{ uniqueVeggies.length }}</span>
      <span>{{ $t('stats.grid3.bottomLabel') }}</span>
    </i18n-t>
    <i18n-t
      keypath="categoryStatus.centerLabel"
      tag="div"
      class="status__item"
      data-test-id="all-time-at-most"
    >
      <span>{{ $t('stats.grid4.topLabel') }}</span>
      <span class="text-5xl">{{ atMostVeggies }}</span>
      <span>{{ $t('stats.grid4.bottomLabel') }}</span>
    </i18n-t>
  </div>
</template>
<style lang="scss" scoped>
.status__container {
  @apply grid grid-cols-2 grid-rows-2 gap-4;
  @apply label-like text-center;
}

.status__item {
  @apply flex flex-col items-center justify-center;
}
</style>
