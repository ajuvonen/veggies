<script setup lang="ts">
import {type ComponentPublicInstance, ref, useTemplateRef} from 'vue';
import {useMemoize} from '@vueuse/core';
import {
  ComboboxRoot,
  ComboboxAnchor,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxPortal,
  ComboboxContent,
  ComboboxViewport,
  ComboboxEmpty,
} from 'reka-ui';
import {Category, type TranslatedListing} from '@/types';
import {getCategoryForVeggie, normalizeForSearch} from '@/utils/helpers';
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
const groups = useTemplateRef('groups');
const searchInput = useTemplateRef<ComponentPublicInstance>('searchInput');
const optionsElement = useTemplateRef('optionsElement');

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
    const normalizedQuery = normalizeForSearch(query.value);
    return translatedVeggies().filter(
      (veggie) =>
        (!category || veggie.category === category) &&
        (!normalizedQuery ||
          normalizeForSearch(veggie.translation).includes(normalizedQuery) ||
          veggie.synonyms.some((synonym) => normalizeForSearch(synonym).includes(normalizedQuery))),
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
  searchInput.value?.$el.focus();
};
</script>
<template>
  <ComboboxRoot v-model="model" v-slot="{open}" multiple ignoreFilter openOnClick>
    <ComboboxAnchor class="relative">
      <ComboboxInput
        v-model="query"
        ref="searchInput"
        id="veggie-search-input"
        :aria-label="placeholder || $t('veggieSearch.search')"
        :placeholder="placeholder || $t('veggieSearch.search')"
        :value="query"
        class="veggie-search__input"
        inputmode="search"
        autocorrect="off"
        autocapitalize="none"
        maxlength="20"
        data-test-id="veggie-search-input"
      />
      <ButtonComponent
        v-if="query"
        :variant="['text', 'alternative']"
        class="veggie-search__button right-12 outline-override"
        icon="close"
        data-test-id="veggie-search-clear-button"
        @click="clearQuery"
      />
      <ComboboxTrigger asChild>
        <ButtonComponent
          :class="{'rotate-180': open}"
          :variant="['text', 'alternative']"
          class="veggie-search__button right-2 outline-override transition duration-200"
          icon="chevronDown"
          data-test-id="veggie-search-toggle-button"
        />
      </ComboboxTrigger>
    </ComboboxAnchor>
    <ComboboxPortal>
      <ComboboxContent class="z-20" position="popper">
        <ComboboxViewport
          ref="optionsElement"
          id="veggie-search-options"
          class="dropdown-list-container"
          style="max-height: calc(var(--reka-combobox-content-available-height) - 1.5rem)"
          data-test-id="veggie-search-options"
        >
          <ComboboxEmpty class="veggie-search__no-results">
            {{ $t('veggieSearch.noResults') }}
          </ComboboxEmpty>
          <VeggieSearchChallenge v-if="!query" />
          <VeggieSearchGroup
            v-for="(category, _, index) in Category"
            ref="groups"
            :key="category"
            :category="category"
            :items="filteredVeggies(category)"
            :showControls="!query"
            @previous="jumpToCategory(index - 1)"
            @next="jumpToCategory(index + 1)"
          />
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
<style scoped>
.veggie-search__input {
  @apply w-full py-2 pl-4 pr-24 rounded-full;
  @apply text-[--color-text-alternative] bg-[--color-bg-alternative] placeholder-gray-500;
}

.veggie-search__button {
  @apply absolute top-1/2 -translate-y-1/2 p-2 -outline-offset-4;
}

.veggie-search__no-results {
  @apply select-none px-4 py-2;
  @apply bg-[--color-bg-alternative] text-[--color-text-alternative];
}
</style>
