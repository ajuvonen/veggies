<script setup lang="ts">
import {ref, useTemplateRef} from 'vue';
import {onClickOutside, useMemoize, usePreferredReducedMotion} from '@vueuse/core';
import {storeToRefs} from 'pinia';
import {Category, type TranslatedListing} from '@/types';
import {getCategoryForVeggie, normalizeForSearch} from '@/utils/helpers';
import {useAvailableVeggies} from '@/hooks/availableVeggies';
import {useI18nWithCollator} from '@/hooks/i18n';
import {useAppStateStore} from '@/stores/appStateStore';
import PermissionDialog from '@/components/PermissionDialog.vue';
import VoiceInputDialog from '@/components/VoiceInputDialog.vue';

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

const reducedMotion = usePreferredReducedMotion();
const {t, tm, collator} = useI18nWithCollator();
const {availableVeggies} = useAvailableVeggies();
const {settings} = storeToRefs(useAppStateStore());

const listOpen = ref(false);
const query = ref('');
const showVoicePermissionDialog = ref(false);
const showVoiceInputDialog = ref(false);
const groups = useTemplateRef('groups');
const searchInput = useTemplateRef('searchInput');
const anchorElement = useTemplateRef('anchorElement');
const contentElement = useTemplateRef('contentElement');
const optionsElement = useTemplateRef('optionsElement');

const translatedVeggies = useMemoize(() =>
  availableVeggies.value
    .map<TranslatedListing>((veggie) => ({
      veggie,
      category: getCategoryForVeggie(veggie)!,
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
        behavior: reducedMotion.value === 'reduce' ? 'instant' : 'smooth',
      });
    }
  }
};

const clearQuery = () => {
  query.value = '';
  if (listOpen.value) {
    searchInput.value?.$el.focus();
  }
};

const handleInput = (event: Event) => {
  query.value = (event.target as HTMLInputElement).value;
  listOpen.value = true;
};

const openVoiceInput = () => {
  listOpen.value = false;
  if (settings.value.AIAllowed === null || settings.value.voiceRecordingAllowed === null) {
    showVoicePermissionDialog.value = true;
  } else if (settings.value.voiceRecordingAllowed) {
    showVoiceInputDialog.value = true;
  }
};

const handleVoicePermissionResolved = (value: boolean) => {
  settings.value.AIAllowed = value;
  settings.value.voiceRecordingAllowed = value;
  if (value) {
    showVoiceInputDialog.value = true;
  }
};

const handleInputBlur = (event: FocusEvent) => {
  if (
    event.relatedTarget instanceof Node &&
    (anchorElement.value?.$el?.contains(event.relatedTarget) ||
      contentElement.value?.$el?.contains(event.relatedTarget))
  ) {
    return;
  }
  listOpen.value = false;
};

onClickOutside(
  optionsElement,
  () => {
    listOpen.value = false;
  },
  {
    ignore: ['.toast-message', '.modal-dialog', anchorElement],
  },
);
</script>
<template>
  <ComboboxRoot
    v-model="model"
    :open="listOpen"
    :resetSearchTermOnBlur="false"
    :resetSearchTermOnSelect="false"
    multiple
    ignoreFilter
  >
    <ComboboxAnchor ref="anchorElement" class="relative fill-[--color-text-alternative]">
      <ButtonComponent
        color="transparent"
        :disabled="settings.AIAllowed === false || settings.voiceRecordingAllowed === false"
        :icon="
          settings.AIAllowed !== false && settings.voiceRecordingAllowed !== false
            ? 'microphone'
            : 'microphoneOff'
        "
        :aria-label="$t('voiceInput.title')"
        class="veggie-search__button left-4 outline-override"
        data-test-id="veggie-search-voice-button"
        @click="openVoiceInput"
        @blur="handleInputBlur"
      />
      <ComboboxInput
        v-model="query"
        ref="searchInput"
        id="veggie-search-input"
        :aria-label="placeholder || $t('veggieSearch.search')"
        :placeholder="placeholder || $t('veggieSearch.search')"
        class="veggie-search__input"
        inputmode="search"
        autocorrect="off"
        autocapitalize="none"
        spellcheck="false"
        maxlength="20"
        data-test-id="veggie-search-input"
        @input="handleInput"
        @compositionstart="handleInput"
        @compositionupdate="handleInput"
        @compositionend="handleInput"
        @focus="listOpen = true"
        @blur="handleInputBlur"
        @keydown.escape.stop.prevent="listOpen = false"
      />
      <ButtonComponent
        v-if="query"
        color="transparent"
        class="veggie-search__button right-12 outline-override"
        icon="close"
        data-test-id="veggie-search-clear-button"
        @click="clearQuery"
        @blur="handleInputBlur"
      />
      <ComboboxTrigger asChild>
        <ButtonComponent
          :class="{'rotate-180': listOpen}"
          color="transparent"
          class="veggie-search__button right-4 outline-override motion-safe:duration-200"
          icon="chevronDown"
          data-test-id="veggie-search-toggle-button"
          @click="listOpen = !listOpen"
        />
      </ComboboxTrigger>
    </ComboboxAnchor>
    <ComboboxPortal>
      <ComboboxContent ref="contentElement" class="z-20" position="popper">
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
  <PermissionDialog
    v-model="showVoicePermissionDialog"
    :message="$t('permissionDialog.voicePermissionMessage')"
    @resolve="handleVoicePermissionResolved"
  />
  <VoiceInputDialog
    v-if="settings.AIAllowed && settings.voiceRecordingAllowed"
    v-model:open="showVoiceInputDialog"
    v-model:veggies="model"
  />
</template>
<style scoped>
.veggie-search__input {
  @apply w-full py-2 pl-12 pr-24 rounded-full;
  @apply text-[--color-text-alternative] bg-[--color-bg-alternative] placeholder-gray-500;
}

.veggie-search__button {
  @apply absolute top-1/2 -translate-y-1/2;
}

.veggie-search__no-results {
  @apply select-none px-4 py-2;
  @apply bg-[--color-bg-alternative] text-[--color-text-alternative];
}
</style>
