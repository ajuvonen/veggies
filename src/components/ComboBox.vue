<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import {useI18n} from 'vue-i18n';
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue';
import {useActivityStore} from '@/stores/activityStore';
import {storeToRefs} from 'pinia';
import {FRUITS, VEGETABLES, LEAFIES, ROOTS, BEANS} from '@/utils/constants';

const {t, locale} = useI18n();

const activityStore = useActivityStore();
const {currentIngredients} = storeToRefs(activityStore);
const {toggleIngredient} = activityStore;

const selected = ref<string | null>(null);
const query = ref('');
const input = ref<InstanceType<typeof ComboboxInput> | null>(null);

onMounted(() => {
  input.value?.$el.focus();
});

const translatedIngredients = computed(() => {
  const collator = new Intl.Collator(locale.value);
  return [...FRUITS, ...VEGETABLES, ...LEAFIES, ...ROOTS, ...BEANS]
    .map((ingredient) => ({
      ...ingredient,
      translation: t(`ingredients.${ingredient.key}`),
    }))
    .sort((a, b) => collator.compare(a.translation, b.translation));
});

const filteredIngredients = computed(
  () => (category: string) =>
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
        <div class="select-none py-2 px-2 bg-slate-300 text-gray-900">Vegetables</div>
        <ComboboxOption
          v-for="ingredient in filteredIngredients('vegetable')"
          :key="ingredient.key"
          :value="ingredient.key"
          v-slot="{active}"
        >
          <li class="select-none py-2 px-4" :class="getOptionClasses(ingredient.key, active)">
            <span class="block truncate">
              {{ ingredient.translation }}
            </span>
          </li>
        </ComboboxOption>
        <div class="select-none py-2 px-2 bg-slate-300 text-gray-900">Fruits</div>
        <ComboboxOption
          v-for="ingredient in filteredIngredients('fruit')"
          :key="ingredient.key"
          :value="ingredient.key"
          v-slot="{active}"
        >
          <li class="select-none py-2 px-4" :class="getOptionClasses(ingredient.key, active)">
            <span class="block truncate">
              {{ ingredient.translation }}
            </span>
          </li>
        </ComboboxOption>
        <div class="select-none py-2 px-2 bg-slate-300 text-gray-900">Leafy Greens</div>
        <ComboboxOption
          v-for="ingredient in filteredIngredients('leafy')"
          :key="ingredient.key"
          :value="ingredient.key"
          v-slot="{active}"
        >
          <li class="select-none py-2 px-4" :class="getOptionClasses(ingredient.key, active)">
            <span class="block truncate">
              {{ ingredient.translation }}
            </span>
          </li>
        </ComboboxOption>
        <div class="select-none py-2 px-2 bg-slate-300 text-gray-900">Roots</div>
        <ComboboxOption
          v-for="ingredient in filteredIngredients('root')"
          :key="ingredient.key"
          :value="ingredient.key"
          v-slot="{active}"
        >
          <li class="select-none py-2 px-4" :class="getOptionClasses(ingredient.key, active)">
            <span class="block truncate">
              {{ ingredient.translation }}
            </span>
          </li>
        </ComboboxOption>
        <div class="select-none py-2 px-2 bg-slate-300 text-gray-900">Beans</div>
        <ComboboxOption
          v-for="ingredient in filteredIngredients('bean')"
          :key="ingredient.key"
          :value="ingredient.key"
          v-slot="{active}"
        >
          <li class="select-none py-2 px-4" :class="getOptionClasses(ingredient.key, active)">
            <span class="block truncate">
              {{ ingredient.translation }}
            </span>
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </TransitionRoot>
  </Combobox>
</template>
