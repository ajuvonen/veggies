<script setup lang="ts">
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {ComboboxOption} from '@headlessui/vue';
import {useActivityStore} from '@/stores/activityStore';
import type {Category, TranslatedIngredient} from '@/utils/types';
import {CATEGORY_EMOJI} from '@/utils/constants';

const props = defineProps<{
  ingredients: TranslatedIngredient[];
  category: Category;
}>();

const {getCurrentIngredients} = storeToRefs(useActivityStore());

const getGroupEmoji = computed(() => CATEGORY_EMOJI[props.category]);

const getOptionClasses = (ingredient: string, active: boolean) => {
  const exists = getCurrentIngredients.value.some(
    (existingIngredient) => existingIngredient.key === ingredient,
  );
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
  <template v-if="ingredients.length">
    <div class="veggie-search__group">
      <span aria-hidden="true">{{ getGroupEmoji }}</span>
      <span>{{ $t(`categories.${category}`) }} ({{ ingredients.length }})</span>
    </div>
    <ComboboxOption
      v-for="ingredient in ingredients"
      :key="ingredient.key"
      :value="ingredient"
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
  @apply flex justify-start gap-2;
  @apply select-none p-2 pr-4;
  @apply bg-slate-300 text-gray-900;
}

.veggie-search__option {
  @apply select-none py-2 px-4 capitalize;
}
</style>
