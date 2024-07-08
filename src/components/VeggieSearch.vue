<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import {useI18n} from 'vue-i18n';
import {Combobox, ComboboxInput, ComboboxOptions, TransitionRoot} from '@headlessui/vue';
import {useActivityStore} from '@/stores/activityStore';
import {FRUITS, VEGETABLES, LEAFIES, ROOTS, BEANS} from '@/utils/constants';
import {Category, type TranslatedIngredient} from '@/utils/types';
import VeggieSearchGroup from './VeggieSearchGroup.vue';

const {t, locale} = useI18n();

const activityStore = useActivityStore();
const {toggleIngredient} = activityStore;

const selected = ref<string | null>(null);
const query = ref('');
const input = ref<InstanceType<typeof ComboboxInput> | null>(null);

onMounted(() => {
  input.value?.$el.focus();
});

const translatedIngredients = computed<TranslatedIngredient[]>(() => {
  const collator = new Intl.Collator(locale.value);
  return [...FRUITS, ...VEGETABLES, ...LEAFIES, ...ROOTS, ...BEANS]
    .map((ingredient) => ({
      ...ingredient,
      translation: t(`ingredients.${ingredient.key}`),
    }))
    .sort((a, b) => collator.compare(a.translation, b.translation));
});

const filteredIngredients = computed(
  () => (category: Category) =>
    translatedIngredients.value.filter(
      (ingredient) =>
        ingredient.category === category &&
        (!query.value ||
          ingredient.translation
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.value.toLowerCase().replace(/\s+/g, ''))),
    ),
);

const add = (newIngredient: string) => {
  if (newIngredient) {
    toggleIngredient(newIngredient);
    selected.value = null;
  }
};
</script>
<template>
  <Combobox
    nullable
    id="ingredient"
    v-model="selected"
    @update:modelValue="add"
    as="div"
    class="relative w-full h-12 max-w-[500px]"
  >
    <ComboboxInput
      ref="input"
      class="w-full h-full border-none py-2 px-4 text-lg rounded-full text-gray-900"
      @change="query = $event.target.value"
    />
    <TransitionRoot
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      @after-leave="query = ''"
    >
      <ComboboxOptions
        class="absolute mt-2 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5"
      >
        <div
          v-if="filteredIngredients.length === 0 && query !== ''"
          class="select-none px-4 py-2 text-gray-700"
        >
          {{ $t('general.noResults') }}
        </div>
        <VeggieSearchGroup
          v-for="group in Category"
          :key="group"
          :groupName="$t(`veggie-search.${group}`)"
          :ingredients="filteredIngredients(group)"
        />
      </ComboboxOptions>
    </TransitionRoot>
  </Combobox>
</template>
