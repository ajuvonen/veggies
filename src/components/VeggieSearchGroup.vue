<script setup lang="ts">
import type {Category, TranslatedListing} from '@/utils/types';
import {CATEGORY_EMOJI} from '@/utils/constants';
import VeggieSearchOption from './VeggieSearchOption.vue';

defineEmits(['previous', 'next']);
defineProps<{
  category: Category;
  items: TranslatedListing[];
  showControls: boolean;
}>();
</script>

<template>
  <li
    v-if="items.length"
    :aria-labelledby="`veggie-search-label-${category}`"
    :data-test-id="`veggie-search-group-${category}`"
    role="group"
  >
    <div class="veggie-search__heading">
      <div class="flex-container">
        <span aria-hidden="true">{{ CATEGORY_EMOJI[category] }}</span>
        <span :id="`veggie-search-label-${category}`" role="text"
          >{{ $t(`categories.${category}`) }} ({{ items.length }})</span
        >
      </div>
      <div v-if="showControls" class="flex-container">
        <ButtonComponent
          :aria-label="$t('veggieSearch.previousCategory')"
          :data-test-id="`veggie-search-previous-${category}`"
          variant="text"
          class="hover:fill-[--color-link-hover]"
          role="button"
          @click="$emit('previous')"
        >
          <IconComponent icon="chevronDoubleUp" />
        </ButtonComponent>
        <ButtonComponent
          :aria-label="$t('veggieSearch.nextCategory')"
          :data-test-id="`veggie-search-next-${category}`"
          variant="text"
          class="hover:fill-[--color-link-hover]"
          role="button"
          @click="$emit('next')"
        >
          <IconComponent icon="chevronDoubleDown" />
        </ButtonComponent>
      </div>
    </div>
    <VeggieSearchOption
      v-for="{veggie, translation} in items"
      :key="veggie"
      :veggie="veggie"
      :translation="translation"
    />
  </li>
</template>

<style scoped>
.veggie-search__heading {
  @apply flex-container justify-between;
  @apply select-none p-2 pr-4;
  @apply bg-[--color-tooltip];
}
</style>
