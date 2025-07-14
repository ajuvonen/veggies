<script setup lang="ts">
import {ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {Combobox, ComboboxInput, ComboboxOptions} from '@headlessui/vue';
import {useMemoize, onClickOutside} from '@vueuse/core';
import {Category, type TranslatedListing} from '@/utils/types';
import {getCategoryForVeggie} from '@/utils/helpers';
import {useScreen} from '@/hooks/screen';
import {useAvailableVeggies} from '@/hooks/availableVeggies';
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

const {t, tm, locale} = useI18n();

const {availableVeggies} = useAvailableVeggies();

const query = ref('');
const menuOpen = ref(false);
const groups = ref<InstanceType<typeof VeggieSearchGroup>[]>([]);
const combobox = ref<HTMLDivElement | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);
const optionsElement = ref<InstanceType<typeof ComboboxOptions> | null>(null);

const {maxHeight} = useScreen(optionsElement);

const translatedVeggies = useMemoize(() => {
  const collator = new Intl.Collator(locale.value);
  return availableVeggies.value
    .map<TranslatedListing>((veggie) => ({
      veggie,
      category: getCategoryForVeggie(veggie) as Category,
      translation: t(`veggies.${veggie}`),
      synonyms: Object.values<string>(tm(`synonyms.${veggie}`)),
    }))
    .sort((a, b) => collator.compare(a.translation, b.translation));
});

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
  if (optionsElement.value) {
    const parsedIndex =
      index < 0 ? groups.value.length - 1 : index > groups.value.length - 1 ? 0 : index;
    const targetGroup = groups.value[parsedIndex].$el;
    optionsElement.value.$el.scrollTo({
      top: targetGroup.offsetTop,
      behavior: 'smooth',
    });
  }
};

const clearQuery = () => {
  query.value = '';
  searchInput.value?.focus();
};

onClickOutside(
  combobox,
  () => {
    menuOpen.value = false;
  },
  {
    ignore: ['.toast-message', '#achievements-dialog'],
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
          :aria-expanded="menuOpen"
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
          @focus="menuOpen = true"
          @keydown.tab="menuOpen = false"
        />
      </ComboboxInput>
      <ButtonComponent
        v-if="query"
        variant="text"
        icon="close"
        class="veggie-search__button right-12 outline-override"
        data-test-id="veggie-search-clear-button"
        @click="clearQuery"
      />
      <ButtonComponent
        :class="{'rotate-180 transform': menuOpen}"
        :aria-expanded="menuOpen"
        variant="text"
        icon="chevronDown"
        class="veggie-search__button right-2 outline-override"
        data-test-id="veggie-search-toggle-button"
        aria-haspopup="listbox"
        aria-controls="veggie-search-options"
        @click="menuOpen = !menuOpen"
      />
      <Transition
        leaveActiveClass="ease-in duration-200"
        leaveFromClass="opacity-100"
        leaveToClass="opacity-0"
      >
        <ComboboxOptions
          v-show="menuOpen"
          ref="optionsElement"
          id="veggie-search-options"
          :style="`max-height: calc(${maxHeight}px - 1rem)`"
          static
          as="div"
          class="veggie-search__options"
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

.veggie-search__options {
  @apply dropdown-list-container;
  scrollbar-width: thin;
  scrollbar-color: initial;
}

.veggie-search__no-results {
  @apply select-none px-4 py-2;
  @apply bg-[--color-bg-alternative] text-[--color-text-alternative];
}
</style>
