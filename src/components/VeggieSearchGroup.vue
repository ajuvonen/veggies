<script setup lang="ts">
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {ComboboxOption} from '@headlessui/vue';
import {useActivityStore} from '@/stores/activityStore';
import type {Category, TranslatedListing} from '@/utils/types';
import {CATEGORY_EMOJI} from '@/utils/constants';

const props = defineProps<{
  items: TranslatedListing[];
  category: Category;
}>();

const {currentveggies} = storeToRefs(useActivityStore());

const getGroupEmoji = computed(() => CATEGORY_EMOJI[props.category]);

const getOptionClasses = (veggie: string, active: boolean) => {
  const exists = currentveggies.value.includes(veggie);
  const textClass = active ? 'text-white' : 'text-gray-900';
  let bgClass = 'bg-white';
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
    <div class="veggie-search__group">
      <span aria-hidden="true">{{ getGroupEmoji }}</span>
      <span>{{ $t(`categories.${category}`) }} ({{ items.length }})</span>
    </div>
    <ComboboxOption v-for="item in items" :key="item.veggie" :value="item" v-slot="{active}">
      <li class="veggie-search__option" :class="getOptionClasses(item.veggie, active)">
        <span class="block truncate">
          {{ item.translation }}
        </span>
      </li>
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
  @apply select-none py-2 px-4 capitalize;
}
</style>
