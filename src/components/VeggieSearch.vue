<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import {useI18n} from 'vue-i18n';
import {Combobox, ComboboxInput, ComboboxOptions, TransitionRoot} from '@headlessui/vue';
import {useActivityStore} from '@/stores/activityStore';
import {FRUITS, VEGETABLES, LEAFIES, ROOTS, BEANS, GRAINS} from '@/utils/constants';
import {Category, type TranslatedIngredient} from '@/utils/types';
import VeggieSearchGroup from './VeggieSearchGroup.vue';

const {t, locale} = useI18n();

const activityStore = useActivityStore();
const {toggleIngredient} = activityStore;

const selected = ref<string[]>([]);
const query = ref('');
const input = ref<InstanceType<typeof ComboboxInput> | null>(null);

onMounted(() => {
  input.value?.$el.focus();
});

const translatedIngredients = computed<TranslatedIngredient[]>(() => {
  const collator = new Intl.Collator(locale.value);
  return [...FRUITS, ...VEGETABLES, ...LEAFIES, ...ROOTS, ...BEANS, ...GRAINS]
    .map((ingredient) => ({
      ...ingredient,
      translation: t(`ingredients.${ingredient.key}`),
    }))
    .sort((a, b) => collator.compare(a.translation, b.translation));
});

const filteredIngredients = computed(
  () => (category?: Category) =>
    translatedIngredients.value.filter(
      (ingredient) =>
        (!category || ingredient.category === category) &&
        (!query.value ||
          ingredient.translation
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.value.toLowerCase().replace(/\s+/g, ''))),
    ),
);

const add = ([{key, category}]: TranslatedIngredient[]) => {
  if (key && category) {
    toggleIngredient(key, category);
    selected.value = [];
  }
};
</script>
<template>
  <Combobox
    nullable
    multiple
    id="ingredient"
    v-model="selected"
    @update:modelValue="add"
    as="div"
    class="relative w-full h-12 max-w-md"
  >
    <ComboboxInput
      ref="input"
      class="veggie-search__input"
      @change="query = $event.target.value"
      :aria-label="$t('veggieSearch.search')"
      :placeholder="$t('veggieSearch.search')"
    />
    <TransitionRoot
      leave="ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      @after-leave="query = ''"
    >
      <ComboboxOptions class="veggie-search__options">
        <div
          v-if="filteredIngredients().length === 0 && query !== ''"
          class="veggie-search__no-results"
        >
          {{ $t('veggieSearch.noResults') }}
        </div>
        <VeggieSearchGroup
          v-for="category in Category"
          :key="category"
          :category="category"
          :ingredients="filteredIngredients(category)"
        />
      </ComboboxOptions>
    </TransitionRoot>
  </Combobox>
</template>
<style lang="scss" scoped>
.veggie-search__input {
  @apply w-full h-full border-none py-2 px-4 text-lg rounded-full;
  @apply text-gray-900;
}

.veggie-search__options {
  @apply absolute mt-2 max-h-60 w-full overflow-auto rounded-md shadow-lg ring-1;
  @apply bg-white ring-black/5;
}

.veggie-search__no-results {
  @apply select-none px-4 py-2;
  @apply text-gray-700;
}
</style>
