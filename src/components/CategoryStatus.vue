<script setup lang="ts">
import FrontPageAnimation from '@/components/FrontPageAnimation.vue';
import CategoryStatusChart from '@/components/charts/CategoryStatusChart.vue';

withDefaults(
  defineProps<{
    veggies: string[];
    totals?: boolean;
  }>(),
  {
    totals: false,
  },
);
</script>
<template>
  <div class="category-status">
    <template v-if="veggies.length">
      <CategoryStatusChart :veggies="veggies" :totals="totals" />
      <h1 class="category-status__center-label">
        <span>{{ $t(totals ? 'weekStatus.topLabelTotal' : 'weekStatus.topLabel') }}</span>
        <span :class="totals ? 'text-5xl' : 'text-6xl'">{{ veggies.length }}</span>
        <span>{{ $t('weekStatus.bottomLabel') }}</span>
      </h1>
    </template>
    <FrontPageAnimation v-else />
  </div>
</template>
<style lang="scss" scoped>
.category-status {
  @apply flex flex-col items-center justify-center;
  @apply relative uppercase w-full min-h-[300px] max-h-[350px];
}

:deep(canvas) {
  @apply relative z-10;
}

.category-status__center-label {
  @apply flex flex-col items-center justify-center;
  @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs;
}
</style>
