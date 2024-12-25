<script lang="ts" setup>
import {computed, provide, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {DateTime} from 'luxon';
import {reverse} from 'remeda';
import {useMemoize} from '@vueuse/core';
import {Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions} from '@headlessui/vue';
import {useActivityStore} from '@/stores/activityStore';
import {KEYS} from '@/utils/constants';
import TagsComponent from '@/components/TagsComponent.vue';
import VeggieSearch from '@/components/VeggieSearch.vue';

const activityStore = useActivityStore();
const {getWeekStarts, veggiesForWeek, challenges} = storeToRefs(activityStore);
const {toggleVeggieForWeek, setVeggiesForWeek} = activityStore;

const {t, locale} = useI18n();

const selectedWeekStart = ref(DateTime.now().startOf('week'));

const veggies = computed({
  get: () => veggiesForWeek.value(selectedWeekStart.value),
  set: (veggies) => setVeggiesForWeek(veggies, selectedWeekStart.value),
});

const formatWeek = computed(
  () => (weekStart: DateTime) =>
    t('stats.selectedWeek', [
      weekStart.weekNumber,
      weekStart.year,
      weekStart.setLocale(locale.value).toLocaleString({month: 'numeric', day: 'numeric'}),
      weekStart
        .setLocale(locale.value)
        .endOf('week')
        .toLocaleString({month: 'numeric', day: 'numeric'}),
    ]),
);

const weekOptions = computed(() => reverse(getWeekStarts.value));

const selectedChallenge = computed(
  () => challenges.value.find(({startDate}) => startDate.equals(selectedWeekStart.value))?.veggie,
);

const getOptionClasses = useMemoize((active: boolean, selected: boolean) => {
  const textClass = active ? 'text-slate-50' : 'text-slate-900';
  let bgClass = 'transparent';
  if (active) {
    bgClass = 'bg-sky-500';
  } else if (selected) {
    bgClass = 'bg-sky-200';
  }
  return `${textClass} ${bgClass}`;
});

provide(KEYS.challenge, selectedChallenge);
</script>
<template>
  <Listbox v-model="selectedWeekStart" class="relative z-30" as="div" v-slot="{open}">
    <div class="flex-container flex-col">
      <ListboxLabel class="label-like">{{ $t('stats.chooseWeek') }}</ListboxLabel>
      <ListboxButton class="week-editor__list-box-button" data-test-id="stats-dropdown-button">
        <span class="truncate">{{ formatWeek(selectedWeekStart) }}</span>
        <IconComponent :class="open ? 'rotate-180 transform' : ''" icon="chevron" />
      </ListboxButton>
    </div>
    <Transition
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <ListboxOptions class="dropdown-list-container">
        <ListboxOption
          v-for="date in weekOptions"
          v-slot="{active, selected}"
          :key="`${date.weekNumber}-${date.year}`"
          :value="date"
          :data-test-id="`stats-dropdown-option-${date.toMillis()}`"
          as="template"
        >
          <li :class="[getOptionClasses(active, selected), 'dropdown-list-option']" role="menuitem">
            {{ formatWeek(date) }}
          </li>
        </ListboxOption>
      </ListboxOptions>
    </Transition>
  </Listbox>
  <VeggieSearch v-if="!DateTime.now().hasSame(selectedWeekStart, 'week')" v-model="veggies" small />
  <TagsComponent
    :veggies="veggiesForWeek(selectedWeekStart)"
    :variant="['tag', 'remove']"
    ariaKey="general.clickToRemove"
    icon="minus"
    @click="(veggie) => toggleVeggieForWeek(veggie, selectedWeekStart)"
  />
</template>
<style lang="scss" scoped>
.week-editor__list-box-button {
  @apply flex items-center justify-between;
  @apply w-full button-like;
  @apply bg-sky-500;

  &:hover {
    @apply bg-sky-600;
  }
}
</style>
