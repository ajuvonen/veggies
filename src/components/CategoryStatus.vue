<script setup lang="ts">
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
  <div class="category-status__chart-background">
    <CategoryStatusChart
      :veggies="veggies"
      :totals="totals"
      aria-labelledby="category-status-center-label"
    />
    <i18n-t
      id="category-status-center-label"
      scope="global"
      keypath="categoryStatus.centerLabel"
      tag="div"
      class="category-status__center-label"
      data-test-id="category-status-center-label"
    >
      <span>{{ $t(totals ? 'categoryStatus.topLabelTotal' : 'categoryStatus.topLabel') }}</span>
      <span :class="totals ? 'text-5xl' : 'text-6xl'">{{ veggies.length }}</span>
      <span>{{
        $t(totals ? 'categoryStatus.bottomLabelTotal' : 'categoryStatus.bottomLabel')
      }}</span>
    </i18n-t>
  </div>
</template>
<style lang="scss" scoped>
:deep(canvas) {
  @apply relative z-10;
}

.category-status__chart-background {
  @apply relative max-h-[50%];
  @apply flex flex-col justify-start items-center;
}

.category-status__center-label {
  @apply flex flex-col items-center justify-center;
  @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 label-like;
}
</style>
