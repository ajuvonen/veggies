<script setup lang="ts">
import {ref, computed} from 'vue';
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

const props = defineProps<{
  ingredients: string[];
}>();

const {t, locale} = useI18n();

const activityStore = useActivityStore();
const {activity} = storeToRefs(activityStore);
const {toggleIngredient} = activityStore;

const selected = ref<string | null>(null);
const query = ref('');
const input = ref<InstanceType<typeof ComboboxInput> | null>(null);

const translatedIngredients = computed(() => {
  const collator = new Intl.Collator(locale.value);
  return props.ingredients
    .map((ingredient) => t(`ingredients.${ingredient}`))
    .sort((a, b) => collator.compare(a, b));
});

const filteredIngredients = computed(() =>
  translatedIngredients.value.filter(
    (ingredient) =>
      !query.value ||
      ingredient
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(query.value.toLowerCase().replace(/\s+/g, '')),
  ),
);

const add = (newIngredient: string) => {
  if (newIngredient) {
    toggleIngredient(newIngredient);
    selected.value = null;
  }
};

const focus = () => {
  input.value?.$el.focus();
};

defineExpose({focus});
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

        <ComboboxOption
          v-for="ingredient in filteredIngredients"
          :key="ingredient"
          :value="ingredient"
          v-slot="{active}"
        >
          <li
            class="select-none py-2 px-4"
            :class="{
              'bg-sky-500 text-white': active,
              'text-gray-900': !active,
            }"
          >
            <span class="block truncate">
              {{ ingredient }}
            </span>
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </TransitionRoot>
  </Combobox>
</template>
