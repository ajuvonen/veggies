<script setup lang="ts">
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {ComboboxOption} from '@headlessui/vue';
import {useActivityStore} from '@/stores/activityStore';
import type {Category, TranslatedListing} from '@/utils/types';
import {CATEGORY_EMOJI, COLORS} from '@/utils/constants';

const props = defineProps<{
  items: TranslatedListing[];
  category: Category;
}>();

const {currentveggies} = storeToRefs(useActivityStore());

const getGroupEmoji = computed(() => CATEGORY_EMOJI[props.category]);

const getOptionClasses = (veggie: string, active: boolean) => {
  const exists = currentveggies.value.includes(veggie);
  const textClass = active ? `text-[${COLORS.offWhite}]` : 'text-gray-900';
  let bgClass = `bg-[${COLORS.offWhite}]`;
  if (active && exists) {
    bgClass = 'bg-red-500';
  } else if (active) {
    bgClass = 'bg-sky-500';
  } else if (exists) {
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
    <ComboboxOption v-for="item in items" :key="item.veggie" :value="item" v-slot="{active}">
      <span :class="[getOptionClasses(item.veggie, active), 'veggie-search__option']">
        {{ item.translation }}
      </span>
    </ComboboxOption>
  </template>
</template>

<style scoped lang="scss">
.veggie-search__group {
  @apply flex justify-start gap-2;
  @apply select-none p-2 pr-4;
  @apply bg-slate-300 text-gray-900;
}

.veggie-search__option {
  @apply dropdown-list-option;
}
</style>
