<script setup lang="ts">
import type {Category, TranslatedListing} from '@/utils/types';
import {CATEGORY_EMOJI} from '@/utils/constants';
import VeggieSearchOption from './VeggieSearchOption.vue';

defineProps<{
  items: TranslatedListing[];
  category: Category;
}>();
</script>

<template>
  <li v-if="items.length" :data-test-id="`veggie-search-group-${category}`">
    <div :id="`veggie-search-heading-${category}`" class="veggie-search__heading">
      <span aria-hidden="true">{{ CATEGORY_EMOJI[category] }}</span>
      <span>{{ $t(`categories.${category}`) }} ({{ items.length }})</span>
    </div>
    <ul :aria-labelledby="`veggie-search-heading-${category}`" role="group">
      <VeggieSearchOption
        v-for="{veggie, translation} in items"
        :key="veggie"
        :veggie="veggie"
        :translation="translation"
      />
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
