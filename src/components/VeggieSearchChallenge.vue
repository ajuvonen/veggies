<script setup lang="ts">
import {inject} from 'vue';
import VeggieSearchOption from '@/components/VeggieSearchOption.vue';
import {KEYS} from '@/utils/constants';

const challenge = inject(KEYS.challenge, undefined);
</script>

<template>
  <li v-if="challenge" data-test-id="veggie-search-challenge">
    <div id="veggie-search-heading-challenge" class="veggie-search__heading">
      <span aria-hidden="true">🎖️</span>
      <span>{{ $t('veggieSearch.challenge') }}</span>
    </div>
    <ul :aria-labelledby="'veggie-search-heading-challenge'" role="group">
      <VeggieSearchOption :veggie="challenge" />
    </ul>
  </li>
</template>

<style scoped>
.veggie-search__heading {
  @apply flex-container justify-start;
  @apply select-none p-2;
  @apply bg-[--color-tooltip] text-[--color-text];
}
</style>
