<script lang="ts" setup>
import {computed, inject, provide, readonly, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {DateTime} from 'luxon';
import {first} from 'remeda';
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
  TransitionRoot,
} from '@headlessui/vue';
import {useActivityStore} from '@/stores/activityStore';
import {KEYS} from '@/utils/constants';
import {useScreen} from '@/hooks/screen';
import TagsComponent from '@/components/TagsComponent.vue';
import VeggieSearch from '@/components/VeggieSearch.vue';

defineEmits(['scroll']);

const activityStore = useActivityStore();
const {getWeekStarts, veggiesForWeek, challenges} = storeToRefs(activityStore);
const {toggleVeggieForWeek, setVeggiesForWeek} = activityStore;

const {t, locale} = useI18n();

const selectedWeekStart = ref(first(getWeekStarts.value)!);

const optionsElement = ref<InstanceType<typeof ListboxOptions> | null>(null);
const {maxHeightStyle} = useScreen(optionsElement);

const veggies = computed({
  get: () => veggiesForWeek.value(selectedWeekStart.value),
  set: (veggies) => setVeggiesForWeek(veggies, selectedWeekStart.value),
});

const formatWeek = computed(
  () => (weekStart: DateTime) =>
    t('stats.selectedWeek', [
      weekStart.toFormat('W/kkkk'),
      weekStart.setLocale(locale.value).toLocaleString({month: 'numeric', day: 'numeric'}),
      weekStart
        .setLocale(locale.value)
        .endOf('week')
        .toLocaleString({month: 'numeric', day: 'numeric'}),
    ]),
);

const selectedChallenge = computed(
  () => challenges.value.find(({startDate}) => startDate.equals(selectedWeekStart.value))?.veggie,
);

provide(KEYS.challenge, readonly(selectedChallenge));
const getDropdownStyles = inject(KEYS.dropdownStyles);
</script>
<template>
  <div class="week-editor">
    <Listbox v-model="selectedWeekStart" class="relative z-30" as="div" v-slot="{open}">
      <ContentElement :title="$t('stats.chooseWeek')" :labelTag="ListboxLabel">
        <ListboxButton
          class="week-editor__dropdown-button"
          data-test-id="week-editor-dropdown-button"
        >
          <span class="truncate">{{ formatWeek(selectedWeekStart) }}</span>
          <IconComponent :class="open ? 'rotate-180 transform' : ''" icon="chevron" />
        </ListboxButton>
      </ContentElement>
      <TransitionRoot
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          ref="optionsElement"
          :style="maxHeightStyle"
          class="dropdown-list-container"
        >
          <ListboxOption
            v-for="(date, index) in getWeekStarts"
            v-slot="{active, selected}"
            :key="`${date.weekNumber}-${date.weekYear}`"
            :value="date"
            :data-test-id="`week-editor-option-${index}`"
            as="template"
          >
            <li
              :class="[getDropdownStyles!(active, selected), 'dropdown-list-option']"
              role="menuitem"
            >
              <span class="truncate">{{ formatWeek(date) }}</span>
              <IconComponent v-if="selected" icon="check" />
            </li>
          </ListboxOption>
        </ListboxOptions>
      </TransitionRoot>
    </Listbox>
    <VeggieSearch v-if="!selectedWeekStart.equals(first(getWeekStarts)!)" v-model="veggies" small />
    <TagsComponent
      :veggies="veggiesForWeek(selectedWeekStart)"
      :variant="['tag', 'remove']"
      ariaKey="general.clickToRemove"
      icon="minus"
      @scroll="$emit('scroll')"
      @toggle="(veggie) => toggleVeggieForWeek(veggie, selectedWeekStart)"
    />
  </div>
</template>
<style scoped>
.week-editor__dropdown-button {
  @apply button-like;
  @apply justify-between;
  @apply bg-[--color-highlight] hover:bg-sky-600;
}
</style>
