<script setup lang="ts">
import {computed} from 'vue';
import {ComboboxOption} from '@headlessui/vue';
import type {Category, TranslatedListing} from '@/utils/types';
import {CATEGORY_EMOJI} from '@/utils/constants';

const props = defineProps<{
  items: TranslatedListing[];
  category: Category;
}>();

const getGroupEmoji = computed(() => CATEGORY_EMOJI[props.category]);

const getOptionClasses = (active: boolean, selected: boolean) => {
  const textClass = active ? 'text-slate-50' : 'text-slate-900 fill-slate-900';
  let bgClass = `bg-slate-50`;
  if (active) {
    bgClass = 'bg-sky-500';
  } else if (selected) {
    bgClass = 'bg-sky-200';
  }

  return `${textClass} ${bgClass}`;
};
</script>

<template>
  <template v-if="items.length">
    <li class="veggie-search__group">
      <span aria-hidden="true">{{ getGroupEmoji }}</span>
      <span>{{ $t(`categories.${category}`) }} ({{ items.length }})</span>
    </li>
    <ComboboxOption
      v-for="{veggie, translation} in items"
      :key="veggie"
      :value="veggie"
      v-slot="{active, selected}"
    >
      <div :class="[getOptionClasses(active, selected), 'veggie-search__option']">
        <span>
          {{ translation }}
        </span>
        <IconComponent v-if="selected" icon="check" />
      </div>
    </ComboboxOption>
  </template>
</template>

<style scoped lang="scss">
.veggie-search__group {
  @apply flex-container justify-start;
  @apply select-none p-2;
  @apply bg-slate-300 text-slate-900;
}

.veggie-search__option {
  @apply dropdown-list-option;
}
</style>
