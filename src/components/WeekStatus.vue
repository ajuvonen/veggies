<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useActivityStore} from '@/stores/activityStore';
import FrontPageAnimation from '@/components/FrontPageAnimation.vue';
import WeekStatusChart from '@/components/charts/WeekStatusChart.vue';

const {currentVeggies} = storeToRefs(useActivityStore());
</script>
<template>
  <div class="week-status">
    <template v-if="currentVeggies.length">
      <WeekStatusChart :currentVeggies="currentVeggies" />
      <h1 class="week-status__center-label">
        <span>{{ $t('weekStatus.topLabel') }}</span>
        <span class="text-6xl">{{ currentVeggies.length }}</span>
        <span>{{ $t('weekStatus.bottomLabel') }}</span>
      </h1>
    </template>
    <FrontPageAnimation v-else />
  </div>
</template>
<style lang="scss" scoped>
.week-status {
  @apply flex flex-col items-center justify-center;
  @apply relative uppercase w-full min-h-[300px] max-h-[350px];
}

:deep(canvas) {
  @apply relative z-10;
}

.week-status__center-label {
  @apply flex flex-col items-center justify-center;
  @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs;
}
</style>
