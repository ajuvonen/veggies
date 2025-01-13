<script setup lang="ts">
import {ref, watch, nextTick, provide} from 'vue';
import {useI18n} from 'vue-i18n';
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  TransitionRoot,
} from '@headlessui/vue';
import {useMemoize} from '@vueuse/core';
import {ALL_VEGGIES, KEYS} from '@/utils/constants';
import {Category, type TranslatedListing} from '@/utils/types';
import {getCategoryForVeggie} from '@/utils/helpers';
import {useScreen} from '@/hooks/screen';
import {useDropdown} from '@/hooks/dropdown';
import VeggieSearchGroup from '@/components/VeggieSearchGroup.vue';
import VeggieSearchChallenge from '@/components/VeggieSearchChallenge.vue';

const model = defineModel<string[]>({
  required: true,
});

withDefaults(
  defineProps<{
    small?: boolean;
  }>(),
  {
    small: false,
  },
);

const {t, locale} = useI18n();

const query = ref('');
const touching = ref(false);

const openButton = ref<typeof ComboboxButton | null>(null);
const optionsElement = ref<InstanceType<typeof ComboboxOptions> | null>(null);
const {maxHeightStyle} = useScreen(optionsElement);
const {getDropdownStyles} = useDropdown();

const allVeggies = useMemoize(() => {
  const collator = new Intl.Collator(locale.value);
  return ALL_VEGGIES.map<TranslatedListing>((veggie) => ({
    veggie,
    category: getCategoryForVeggie(veggie) as Category,
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

const onMenuClose = () => {
  query.value = '';
  touching.value = false;
  openButton.value?.$el.focus();
};

const scrollToStart = async () => {
  await nextTick();
  if (optionsElement.value) {
    optionsElement.value.$el.scrollTop = 0;
  }
};

watch(query, scrollToStart);
provide(KEYS.getDropdownStyles, getDropdownStyles);
</script>
<template>
  <Combobox
    v-model="model"
    v-slot="{open}"
    nullable
    multiple
    as="div"
    :class="{'h-12': !small}"
    class="relative z-20"
  >
    <ComboboxInput
      :aria-label="$t('veggieSearch.search')"
      :placeholder="$t('veggieSearch.search')"
      :class="{'veggie-search__input--small': small}"
      class="veggie-search__input"
      data-test-id="veggie-search-input"
      @change="query = $event.target.value"
      @click="!open && openButton?.$el.click()"
    />
    <ComboboxButton
      ref="openButton"
      :class="open ? 'rotate-180 transform' : ''"
      class="veggie-search__button"
      data-test-id="veggie-search-button"
    >
      <IconComponent icon="chevron" aria-hidden="true" />
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
        class="veggie-search__options"
        data-test-id="veggie-search-options"
      >
        <li v-if="filteredVeggies().length === 0 && query !== ''" class="veggie-search__no-results">
          {{ $t('veggieSearch.noResults') }}
        </li>
        <VeggieSearchChallenge v-if="!query.length" />
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

  &--small {
    @apply h-9 text-base rounded-md leading-4;
  }
}

.veggie-search__button {
  @apply absolute inset-y-2 right-4;
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
