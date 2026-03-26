<script setup lang="ts">
import type {Category, TranslatedListing} from '@/types';
import {CATEGORY_EMOJI} from '@/utils/constants';

defineEmits(['previous', 'next']);
defineProps<{
  category: Category;
  items: TranslatedListing[];
  showControls: boolean;
}>();
</script>

<template>
  <ComboboxGroup v-if="items.length" :data-test-id="`veggie-search-group-${category}`" role="group">
    <div class="dropdown-list-heading">
      <ComboboxLabel class="flex-container">
        <span aria-hidden="true">{{ CATEGORY_EMOJI[category] }}</span>
        <span>{{ $t(`categories.${category}`) }} ({{ items.length }})</span>
      </ComboboxLabel>
      <div v-if="showControls" class="flex-container">
        <ButtonComponent
          :aria-label="$t('veggieSearch.previousCategory')"
          :data-test-id="`veggie-search-previous-${category}`"
          icon="chevronDoubleUp"
          variant="text"
          class="hover:fill-[--color-link-hover]"
          @click="$emit('previous')"
        />
        <ButtonComponent
          :aria-label="$t('veggieSearch.nextCategory')"
          :data-test-id="`veggie-search-next-${category}`"
          icon="chevronDoubleDown"
          variant="text"
          class="hover:fill-[--color-link-hover]"
          @click="$emit('next')"
        />
      </div>
    </div>
    <VeggieSearchOption
      v-for="{veggie, translation} in items"
      :key="veggie"
      :veggie="veggie"
      :translation="translation"
    />
  </ComboboxGroup>
</template>
