<script setup lang="ts">
import useDateTime from '@/hooks/dateTime';

const {getTotalWeeks, getDateInterval} = useDateTime();
</script>
<template>
  <div class="week-status">
    <h1 class="text-xl uppercase">
      {{ $t('general.weekInterval', [getTotalWeeks]) }}
    </h1>
    <span class="text-xs">{{ getDateInterval(getTotalWeeks - 1) }}</span>
  </div>
</template>
<style lang="scss" scoped>
.week-status {
  @apply flex flex-col gap-2 items-center justify-center;
  @apply pb-4;
}
</style>
