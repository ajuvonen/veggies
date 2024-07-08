<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {ComboboxOption} from '@headlessui/vue';
import {useActivityStore} from '@/stores/activityStore';
import type {TranslatedIngredient} from '@/utils/types';

defineProps<{
  ingredients: TranslatedIngredient[];
  groupName: string;
}>();

const {currentIngredients} = storeToRefs(useActivityStore());

const getOptionClasses = (ingredient: string, active: boolean) => {
  const exists = currentIngredients.value.includes(ingredient);
  const textClass = active ? 'text-white' : 'text-gray-900';
  let bgClass = 'bg-white';
  if (active && exists) {
    bgClass = 'bg-red-500';
  } else if (active) {
    bgClass = 'bg-sky-500';
  } else if (exists) {
    bgClass = 'bg-green-300';
  }

  return `${textClass} ${bgClass}`;
};
</script>

<template>
  <template v-if="ingredients.length">
    <div class="veggie-search__group">{{ groupName }}</div>
    <ComboboxOption
      v-for="ingredient in ingredients"
      :key="ingredient.key"
      :value="ingredient.key"
      v-slot="{active}"
    >
      <li class="veggie-search__option" :class="getOptionClasses(ingredient.key, active)">
        <span class="block truncate">
          {{ ingredient.translation }}
        </span>
      </li>
    </ComboboxOption>
  </template>
</template>

<style scoped lang="scss">
.veggie-search__group {
  @apply select-none py-2 px-2;
  @apply bg-slate-300 text-gray-900;
}

.veggie-search__option {
  @apply select-none py-2 px-4;
}
</style>
