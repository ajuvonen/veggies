<script setup lang="ts">
import {inject} from 'vue';
import VeggieSearchOption from '@/components/VeggieSearchOption.vue';
import {KEYS} from '@/utils/constants';

const challenge = inject(KEYS.challenge, undefined);
</script>

<template>
  <ul
    v-if="challenge"
    role="group"
    aria-labelledby="veggie-search-label-challenge"
    data-test-id="veggie-search-challenge"
  >
    <li class="veggie-search__heading" role="presentation">
      <span aria-hidden="true">🎖️</span>
      <span id="veggie-search-label-challenge" role="presentation">{{
        $t('veggieSearch.challenge')
      }}</span>
    </li>
    <VeggieSearchOption :veggie="challenge" />
  </ul>
</template>

<style scoped>
.veggie-search__heading {
  @apply flex-container justify-start;
  @apply select-none p-2;
  @apply bg-[--color-tooltip];
}
</style>
