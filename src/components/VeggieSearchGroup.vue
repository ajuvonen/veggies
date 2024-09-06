<script setup lang="ts">
import {useMemoize} from '@vueuse/core';
import {ComboboxOption} from '@headlessui/vue';
import type {Category, TranslatedListing} from '@/utils/types';
import {CATEGORY_EMOJI} from '@/utils/constants';

defineProps<{
  items: TranslatedListing[];
  category: Category;
}>();

const getOptionClasses = useMemoize((active: boolean, selected: boolean) => {
  const textClass = active ? 'text-slate-50' : 'text-slate-900 fill-slate-900';
  let bgClass = `bg-slate-50`;
  if (active) {
    bgClass = 'bg-sky-500';
  } else if (selected) {
    bgClass = 'bg-sky-200';
  }

  return `${textClass} ${bgClass}`;
});
</script>

<template>
  <li v-if="items.length">
    <div :id="`veggie-search-heading-${category}`" class="veggie-search__heading">
      <span aria-hidden="true">{{ CATEGORY_EMOJI[category] }}</span>
      <span>{{ $t(`categories.${category}`) }} ({{ items.length }})</span>
    </div>
    <ul role="group" :aria-labelledby="`veggie-search-heading-${category}`">
      <ComboboxOption
        v-for="{veggie, translation} in items"
        v-slot="{active, selected}"
        as="template"
        :key="veggie"
        :value="veggie"
      >
        <li :class="[getOptionClasses(active, selected), 'veggie-search__option']" role="menuitem">
          <span>
            {{ translation }}
          </span>
          <IconComponent v-if="selected" icon="check" />
        </li>
      </ComboboxOption>
    </ul>
  </li>
</template>

<style scoped lang="scss">
.veggie-search__heading {
  @apply flex-container justify-start;
  @apply select-none p-2;
  @apply bg-slate-300 text-slate-900;
}

.veggie-search__option {
  @apply dropdown-list-option;
}
</style>
