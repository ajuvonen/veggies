<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import {useI18n} from 'vue-i18n';
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  TransitionRoot,
} from '@headlessui/vue';
import {useElementBounding, useMemoize, useWindowSize} from '@vueuse/core';
import {ALL_VEGGIES} from '@/utils/constants';
import {Category, type TranslatedListing} from '@/utils/types';
import VeggieSearchGroup from '@/components/VeggieSearchGroup.vue';
import {getCategoryForVeggie} from '@/utils/helpers';

const model = defineModel<string[]>({
  required: true,
});

const {t, locale} = useI18n();

const query = ref('');
const input = ref<InstanceType<typeof ComboboxInput> | null>(null);

const optionsElement = ref<InstanceType<typeof ComboboxOptions> | null>(null);
const {top} = useElementBounding(optionsElement);
const {height} = useWindowSize();

onMounted(() => {
  input.value?.$el.focus();
});

const allVeggies = useMemoize(() => {
  const collator = new Intl.Collator(locale.value);
  return ALL_VEGGIES.map<TranslatedListing>((veggie) => ({
    veggie,
    category: getCategoryForVeggie(veggie),
    translation: t(`veggies.${veggie}`),
  })).sort((a, b) => collator.compare(a.translation, b.translation));
});

const filteredVeggies = useMemoize(
  (category?: Category) =>
    allVeggies().filter(
      (item) =>
        (!category || item.category === category) &&
        (!query.value ||
          item.translation
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.value.toLowerCase().replace(/\s+/g, ''))),
    ),
  {
    getKey: (category?: Category) => `${category}_${query.value}`,
  },
);

const getAvailableHeightForOptions = computed(
  () => `max-height: calc(${height.value}px - ${top.value}px - 1rem)`,
);
</script>
<template>
  <Combobox nullable multiple v-model="model" as="div" class="relative h-12 z-10">
    <ComboboxInput
      ref="input"
      :aria-label="$t('veggieSearch.search')"
      :placeholder="$t('veggieSearch.search')"
      class="veggie-search__input"
      @change="query = $event.target.value"
    />
    <ComboboxButton class="veggie-search__button">
      <IconComponent icon="chevron" aria-hidden="true" />
    </ComboboxButton>
    <TransitionRoot
      leave="ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      @after-leave="query = ''"
    >
      <ComboboxOptions
        ref="optionsElement"
        :style="getAvailableHeightForOptions"
        class="veggie-search__options"
      >
        <li v-if="filteredVeggies().length === 0 && query !== ''" class="veggie-search__no-results">
          {{ $t('veggieSearch.noResults') }}
        </li>
        <VeggieSearchGroup
          v-for="category in Category"
          :key="category"
          :category="category"
          :items="filteredVeggies(category)"
        />
      </ComboboxOptions>
    </TransitionRoot>
  </Combobox>
</template>
<style lang="scss" scoped>
.veggie-search__input {
  @apply w-full h-full py-2 pl-4 pr-8 text-lg rounded-full;
  @apply text-slate-900 bg-slate-50;
}

.veggie-search__button {
  @apply absolute inset-y-3 right-4;
  @apply fill-slate-900;
}

.veggie-search__options {
  @apply dropdown-list-container;
  scrollbar-width: thin;
  scrollbar-color: initial;
}

.veggie-search__no-results {
  @apply select-none px-4 py-2;
  @apply text-slate-700;
}
</style>
