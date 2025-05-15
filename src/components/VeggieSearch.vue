<script setup lang="ts">
import {ref, watch, nextTick} from 'vue';
import {useI18n} from 'vue-i18n';
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  TransitionRoot,
} from '@headlessui/vue';
import {useMemoize} from '@vueuse/core';
import {ALL_VEGGIES} from '@/utils/constants';
import {Category, type TranslatedListing} from '@/utils/types';
import {getCategoryForVeggie} from '@/utils/helpers';
import {useScreen} from '@/hooks/screen';
import VeggieSearchGroup from '@/components/VeggieSearchGroup.vue';
import VeggieSearchChallenge from '@/components/VeggieSearchChallenge.vue';

const model = defineModel<string[]>({
  required: true,
});

const {t, tm, locale} = useI18n();

const query = ref('');
const groups = ref<InstanceType<typeof VeggieSearchGroup>[]>([]);

const openButton = ref<typeof ComboboxButton | null>(null);
const searchInput = ref<typeof ComboboxInput | null>(null);
const optionsElement = ref<InstanceType<typeof ComboboxOptions> | null>(null);
const {maxHeightStyle} = useScreen(optionsElement);

const allVeggies = useMemoize(() => {
  const collator = new Intl.Collator(locale.value);
  return ALL_VEGGIES.map<TranslatedListing>((veggie) => ({
    veggie,
    category: getCategoryForVeggie(veggie) as Category,
    translation: t(`veggies.${veggie}`),
    synonyms: Object.values<string>(tm(`synonyms.${veggie}`)),
  })).sort((a, b) => collator.compare(a.translation, b.translation));
});

const filteredVeggies = useMemoize(
  (category?: Category) => {
    const cleanedQuery = query.value.toLowerCase().replace(/\s+/g, '');
    return allVeggies().filter(
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

const onMenuClose = () => {
  query.value = '';
  openButton.value?.$el.focus();
};

const scrollToStart = async () => {
  await nextTick();
  if (optionsElement.value) {
    optionsElement.value.$el.scrollTop = 0;
  }
};

const jump = (index: number) => {
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

watch(query, scrollToStart);
watch(model, () => {
  if (searchInput.value && query.value) {
    searchInput.value.$el.value = '';
    searchInput.value.$el.dispatchEvent(new Event('input', {bubbles: true}));
  }
});
</script>
<template>
  <Combobox v-model="model" v-slot="{open}" nullable multiple as="div" class="relative z-20">
    <ComboboxInput
      ref="searchInput"
      :aria-label="$t('veggieSearch.search')"
      :placeholder="$t('veggieSearch.search')"
      class="veggie-search__input"
      data-test-id="veggie-search-input"
      inputmode="search"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="none"
      @focus="console.log('focus')"
      @blur="console.log('blur')"
      @change="query = $event.target.value"
      @click="!open && openButton?.$el.click()"
    />
    <ComboboxButton
      ref="openButton"
      :class="open ? 'rotate-180 transform' : ''"
      class="veggie-search__button"
      data-test-id="veggie-search-button"
    >
      <IconComponent icon="chevronDown" aria-hidden="true" />
    </ComboboxButton>
    <TransitionRoot
      leave="ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      @after-enter="scrollToStart"
      @after-leave="onMenuClose"
    >
      <ComboboxOptions
        ref="optionsElement"
        :style="maxHeightStyle"
        as="div"
        class="dropdown-list-options"
        data-test-id="veggie-search-options"
      >
        <li
          v-if="filteredVeggies().length === 0 && query !== ''"
          class="veggie-search__no-results"
          role="presentation"
        >
          {{ $t('veggieSearch.noResults') }}
        </li>
        <VeggieSearchChallenge v-if="!query.length" />
        <VeggieSearchGroup
          v-for="(category, _, index) in Category"
          ref="groups"
          :key="category"
          :category="category"
          :items="filteredVeggies(category)"
          :showControls="!query.length"
          @previous="jump(index - 1)"
          @next="jump(index + 1)"
        />
      </ComboboxOptions>
    </TransitionRoot>
  </Combobox>
</template>
<style scoped>
.veggie-search__input {
  @apply w-full h-full py-2 pl-4 pr-8 text-lg rounded-full;
  @apply text-[--color-text-alternative] bg-[--color-bg-alternative];

  &::placeholder {
    @apply text-gray-500;
  }
}

.veggie-search__button {
  @apply absolute inset-y-2 right-4 rounded-md;
  @apply fill-[--color-text-alternative];
}

.dropdown-list-options {
  @apply dropdown-list-container;
  scrollbar-width: thin;
  scrollbar-color: initial;
}

.veggie-search__no-results {
  @apply select-none px-4 py-2;
  @apply bg-[--color-bg-alternative] text-[--color-text-alternative];
}
</style>
