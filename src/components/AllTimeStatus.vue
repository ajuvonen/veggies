<script lang="ts" setup>
import {storeToRefs} from 'pinia';
import {useActivityStore} from '@/stores/activityStore';
import StatisticShareButton from '@/components/StatContainer.vue';

const activitysStore = useActivityStore();
const {over30Veggies, atMostVeggies, getWeekStarts, uniqueVeggies, completedChallenges} =
  storeToRefs(activitysStore);
</script>
<template>
  <div class="status__container">
    <i18n-t
      scope="global"
      keypath="categoryStatus.centerLabel"
      tag="div"
      class="status__item"
      data-test-id="all-time-weeks"
    >
      <StatisticShareButton :statAmount="getWeekStarts.length" statKey="totalWeeks" />
    </i18n-t>
    <i18n-t
      scope="global"
      keypath="categoryStatus.centerLabel"
      tag="div"
      class="status__item"
      data-test-id="all-time-over-30"
    >
      <StatisticShareButton :statAmount="over30Veggies" statKey="over30Veggies" />
    </i18n-t>
    <i18n-t
      scope="global"
      keypath="categoryStatus.centerLabel"
      tag="div"
      class="status__item"
      data-test-id="all-time-unique"
    >
      <StatisticShareButton :statAmount="uniqueVeggies.length" statKey="uniqueVeggies" />
    </i18n-t>
    <i18n-t
      scope="global"
      keypath="categoryStatus.centerLabel"
      tag="div"
      class="status__item"
      data-test-id="all-time-at-most"
    >
      <StatisticShareButton :statAmount="atMostVeggies" statKey="atMostVeggies" />
    </i18n-t>
    <i18n-t
      scope="global"
      keypath="categoryStatus.centerLabel"
      tag="div"
      class="status__item col-span-2"
      data-test-id="all-time-challenges"
    >
      <StatisticShareButton :statAmount="completedChallenges" statKey="completedChallenges" />
    </i18n-t>
  </div>
</template>
<style lang="scss" scoped>
.status__container {
  @apply grid grid-cols-2 grid-rows-3;
  @apply text-center;
  row-gap: 1rem;
}

.status__item {
  @apply label-like;
  @apply flex flex-col items-center justify-center;
}
</style>
