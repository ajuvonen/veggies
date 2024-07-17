<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import {useI18n} from 'vue-i18n';
import {Combobox, ComboboxInput, ComboboxOptions, TransitionRoot} from '@headlessui/vue';
import {useElementBounding, useWindowSize} from '@vueuse/core';
import {FRUITS, VEGETABLES, LEAFIES, ROOTS, BEANS, GRAINS} from '@/utils/constants';
import {Category, type TranslatedListing} from '@/utils/types';
import VeggieSearchGroup from '@/components/VeggieSearchGroup.vue';
import {getCategoryForVeggie} from '@/utils/helpers';

const emit = defineEmits(['toggle']);

const {t, locale} = useI18n();

const selected = ref<string[]>([]);
const query = ref('');
const input = ref<InstanceType<typeof ComboboxInput> | null>(null);

const optionsElement = ref<InstanceType<typeof ComboboxOptions> | null>(null);
const {top} = useElementBounding(optionsElement);
const {height} = useWindowSize();

onMounted(() => {
  input.value?.$el.focus();
});

const allVeggies = computed(() => {
  const collator = new Intl.Collator(locale.value);
  return [...FRUITS, ...VEGETABLES, ...LEAFIES, ...ROOTS, ...BEANS, ...GRAINS]
    .map<TranslatedListing>((veggie) => ({
      veggie,
      category: getCategoryForVeggie(veggie),
      translation: t(`veggies.${veggie}`),
    }))
    .sort((a, b) => collator.compare(a.translation, b.translation));
});

const filteredveggies = computed(
  () => (category?: Category) =>
    allVeggies.value.filter(
      (item) =>
        (!category || item.category === category) &&
        (!query.value ||
          item.translation
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.value.toLowerCase().replace(/\s+/g, ''))),
    ),
);

const add = ([{veggie}]: TranslatedListing[]) => {
  emit('toggle', veggie);
  selected.value = [];
};

const getAvailableHeightForOptions = computed(
  () => `max-height: calc(${height.value}px - ${top.value}px - 1rem)`,
);
</script>
<template>
  <Combobox
    nullable
    multiple
    v-model="selected"
    @update:modelValue="add"
    as="div"
    class="relative w-full h-12 z-10"
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
      <ComboboxOptions
        class="veggie-search__options"
        ref="optionsElement"
        :style="getAvailableHeightForOptions"
      >
        <div
          v-if="filteredveggies().length === 0 && query !== ''"
          class="veggie-search__no-results"
        >
          {{ $t('veggieSearch.noResults') }}
        </div>
        <VeggieSearchGroup
          v-for="category in Category"
          :key="category"
          :category="category"
          :items="filteredveggies(category)"
        />
      </ComboboxOptions>
    </TransitionRoot>
  </Combobox>
</template>
<style lang="scss" scoped>
.veggie-search__input {
  @apply w-full h-full py-2 px-4 text-lg rounded-full;
  @apply text-slate-900 bg-[#fafafa];
}

.veggie-search__options {
  @apply dropdown-list-container;
}

.veggie-search__no-results {
  @apply select-none px-4 py-2;
  @apply text-slate-700;
}
</style>
