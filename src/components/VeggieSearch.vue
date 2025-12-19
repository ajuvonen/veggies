<script setup lang="ts">
import {ref, useTemplateRef} from 'vue';
import {Combobox, ComboboxInput, ComboboxOptions} from '@headlessui/vue';
import {useMemoize, onClickOutside} from '@vueuse/core';
import {Category, type TranslatedListing} from '@/types';
import {getCategoryForVeggie} from '@/utils/helpers';
import {useScreen} from '@/hooks/screen';
import {useAvailableVeggies} from '@/hooks/availableVeggies';
import {useI18nWithCollator} from '@/hooks/i18n';
import VeggieSearchGroup from '@/components/VeggieSearchGroup.vue';
import VeggieSearchChallenge from '@/components/VeggieSearchChallenge.vue';

const model = defineModel<string[]>({
  required: true,
});

withDefaults(
  defineProps<{
    placeholder?: string;
  }>(),
  {
    placeholder: '',
  },
);

const {t, tm, collator} = useI18nWithCollator();

const {availableVeggies} = useAvailableVeggies();

const query = ref('');
const listOpen = ref(false);
const groups = useTemplateRef('groups');
const combobox = useTemplateRef('combobox');
const searchInput = useTemplateRef('searchInput');
const optionsElement = useTemplateRef('optionsElement');

const {maxHeight} = useScreen(optionsElement);

const translatedVeggies = useMemoize(() =>
  availableVeggies.value
    .map<TranslatedListing>((veggie) => ({
      veggie,
      category: getCategoryForVeggie(veggie) as Category,
      translation: t(`veggies.${veggie}`),
      synonyms: Object.values<string>(tm(`synonyms.${veggie}`)),
    }))
    .sort((a, b) => collator.value.compare(a.translation, b.translation)),
);

const filteredVeggies = useMemoize(
  (category?: Category) => {
    const cleanedQuery = query.value.toLowerCase().replace(/\s+/g, '');
    return translatedVeggies().filter(
      (veggie) =>
        (!category || veggie.category === category) &&
        (!cleanedQuery ||
          veggie.translation.replace(/\s+/g, '').includes(cleanedQuery) ||
          veggie.synonyms.some((synonym) => synonym.replace(/\s+/g, '').includes(cleanedQuery))),
    );
  },
  {
    getKey: (category?: Category) => `${category}_${query.value}`,
  },
);

const jumpToCategory = (index: number) => {
  if (optionsElement.value && groups.value) {
    const parsedIndex =
      index < 0 ? groups.value.length - 1 : index > groups.value.length - 1 ? 0 : index;
    const targetGroup = groups.value[parsedIndex]?.$el as HTMLElement | undefined;
    if (targetGroup) {
      optionsElement.value.$el.scrollTo({
        top: targetGroup.offsetTop,
        behavior: 'smooth',
      });
    }
  }
};

const clearQuery = () => {
  query.value = '';
  searchInput.value?.focus();
};

onClickOutside(
  combobox,
  () => {
    listOpen.value = false;
  },
  {
    ignore: ['.toast-message', '#achievement-dialog'],
  },
);
</script>
<template>
  <div ref="combobox" class="relative z-20">
    <Combobox v-model="model" nullable multiple>
      <ComboboxInput as="template" id="veggie-search-input">
        <input
          ref="searchInput"
          :aria-label="placeholder || $t('veggieSearch.search')"
          :aria-expanded="listOpen"
          :placeholder="placeholder || $t('veggieSearch.search')"
          :value="query"
          class="veggie-search__input"
          inputmode="search"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="none"
          maxlength="20"
          data-test-id="veggie-search-input"
          @input="
            (event: Event) => {
              const target = event.target as HTMLInputElement;
              query = target.value;
            }
          "
          @focus="listOpen = true"
          @keydown.tab="listOpen = false"
        />
      </ComboboxInput>
      <ButtonComponent
        v-if="query"
        :aria-label="$t('general.clear')"
        variant="text"
        icon="close"
        class="veggie-search__button right-12 outline-override"
        data-test-id="veggie-search-clear-button"
        @click="clearQuery"
      />
      <ButtonComponent
        :class="{'rotate-180 transform': listOpen}"
        :aria-label="listOpen ? $t('general.closeList') : $t('general.openList')"
        :aria-expanded="listOpen"
        variant="text"
        icon="chevronDown"
        class="veggie-search__button right-2 outline-override"
        aria-haspopup="listbox"
        aria-controls="veggie-search-options"
        data-test-id="veggie-search-toggle-button"
        @click="listOpen = !listOpen"
      />
      <Transition
        leaveActiveClass="ease-in duration-200"
        leaveFromClass="opacity-100"
        leaveToClass="opacity-0"
      >
        <ComboboxOptions
          v-show="listOpen"
          ref="optionsElement"
          id="veggie-search-options"
          :style="`max-height: calc(${maxHeight}px - 1rem)`"
          static
          as="div"
          class="dropdown-list-container"
          data-test-id="veggie-search-options"
        >
          <div
            v-if="query && !filteredVeggies().length"
            class="veggie-search__no-results"
            role="presentation"
          >
            {{ $t('veggieSearch.noResults') }}
          </div>
          <VeggieSearchChallenge v-if="!query" />
          <VeggieSearchGroup
            v-for="(category, _, index) in Category"
            ref="groups"
            :key="category"
            :category="category"
            :items="filteredVeggies(category)"
            :showControls="!query.length"
            @previous="jumpToCategory(index - 1)"
            @next="jumpToCategory(index + 1)"
          />
        </ComboboxOptions>
      </Transition>
    </Combobox>
  </div>
</template>
<style scoped>
.veggie-search__input {
  @apply w-full h-full py-2 pl-4 pr-24 rounded-full;
  @apply text-[--color-text-alternative] bg-[--color-bg-alternative] placeholder-gray-500;
}

.veggie-search__button {
  @apply absolute top-1/2 -translate-y-1/2 p-2 -outline-offset-4;
  @apply fill-[--color-text-alternative];
}

.veggie-search__no-results {
  @apply select-none px-4 py-2;
  @apply bg-[--color-bg-alternative] text-[--color-text-alternative];
}
</style>
