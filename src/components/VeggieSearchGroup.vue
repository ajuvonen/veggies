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
  <li v-if="items.length" :data-test-id="`veggie-search-group-${category}`">
    <div :id="`veggie-search-heading-${category}`" class="veggie-search__heading">
      <div class="flex-container">
        <span aria-hidden="true">{{ CATEGORY_EMOJI[category] }}</span>
        <span>{{ $t(`categories.${category}`) }} ({{ items.length }})</span>
      </div>
      <div v-if="showControls" class="flex-container gap-4">
        <ButtonComponent
          :aria-label="$t('veggieSearch.previousCategory')"
          :data-test-id="`veggie-search-previous-${category}`"
          variant="text"
          class="self-end"
          @click="$emit('previous')"
        >
          <IconComponent icon="chevronDoubleUp" />
        </ButtonComponent>
        <ButtonComponent
          :aria-label="$t('veggieSearch.nextCategory')"
          :data-test-id="`veggie-search-next-${category}`"
          variant="text"
          class="self-end"
          @click="$emit('next')"
        >
          <IconComponent icon="chevronDoubleDown" />
        </ButtonComponent>
      </div>
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
  @apply flex-container justify-between;
  @apply select-none p-2 pr-4;
  @apply bg-[--color-tooltip] text-[--color-text];
}
</style>
