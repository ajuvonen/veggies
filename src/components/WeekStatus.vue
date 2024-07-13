<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useActivityStore} from '@/stores/activityStore';
import FrontPageAnimation from '@/components/FrontPageAnimation.vue';
import WeekStatusChart from '@/components/charts/WeekStatusChart.vue';

const {currentveggies} = storeToRefs(useActivityStore());
</script>
<template>
  <div class="week-status">
    <div class="relative" v-if="currentveggies.length">
      <WeekStatusChart :currentveggies="currentveggies" />
      <h1 class="week-status__center-label">
        <span>{{ $t('weekStatus.topLabel') }}</span>
        <span class="text-6xl">{{ currentveggies.length }}</span>
        <span>{{ $t('weekStatus.bottomLabel') }}</span>
      </h1>
    </div>
    <FrontPageAnimation v-else />
  </div>
</template>
<style lang="scss" scoped>
.week-status {
  @apply flex flex-col items-center justify-center;
  @apply uppercase w-[300px] h-[300px];
}

:deep(canvas) {
  @apply relative z-10;
}

.week-status__center-label {
  @apply flex flex-col items-center justify-center;
  @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs;
}
</style>
