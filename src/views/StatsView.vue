<script lang="ts" setup>
import {ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useMemoize} from '@vueuse/core';
import {Listbox, ListboxLabel, ListboxButton, ListboxOption, ListboxOptions} from '@headlessui/vue';
import {useActivityStore} from '@/stores/activityStore';
import TagsComponent from '@/components/TagsComponent.vue';
import WeeklyAmountsChart from '@/components/charts/WeeklyAmountsChart.vue';
import WeeklyCategoriesChart from '@/components/charts/WeeklyCategoriesChart.vue';
import AllTimeStatus from '@/components/AllTimeStatus.vue';
import CategoryStatusChart from '@/components/charts/CategoryStatusChart.vue';
import AchievementList from '@/components/AchievementList.vue';
import VeggieList from '@/components/VeggieList.vue';

const activityStore = useActivityStore();
const {currentVeggies, allVeggies, uniqueVeggies, favorites} = storeToRefs(activityStore);
const {toggleVeggie} = activityStore;

const selectedStat = ref(0);

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
</script>
<template>
  <h1 class="sr-only">{{ $t('views.stats') }}</h1>
  <Listbox v-model="selectedStat" class="relative z-20" as="div" v-slot="{open}">
    <div class="flex-container flex-col">
      <ListboxLabel class="label-like">{{ $t('stats.chosenStats') }}</ListboxLabel>
      <ListboxButton class="stats__list-box-button" data-test-id="stats-dropdown-button">
        <span class="truncate">{{ $t(`stats.${selectedStat}`) }}</span>
        <IconComponent :class="open ? 'rotate-180 transform' : ''" icon="chevron" />
      </ListboxButton>
    </div>
    <Transition
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <ListboxOptions class="stats__list-box-options">
        <ListboxOption
          v-for="(_, index) in [...Array(5)]"
          v-slot="{active, selected}"
          :key="index"
          :value="index"
          :data-test-id="`stats-dropdown-option-${index}`"
          as="template"
        >
          <li
            :class="[getOptionClasses(active, selected), 'stats__list-box-option']"
            role="menuitem"
          >
            {{ $t(`stats.${index}`) }}
          </li>
        </ListboxOption>
      </ListboxOptions>
    </Transition>
  </Listbox>
  <TagsComponent
    v-if="selectedStat === 0"
    :veggies="currentVeggies"
    :variant="['tag', 'remove']"
    ariaKey="general.clickToRemove"
    icon="minus"
    @click="toggleVeggie"
  />
  <WeeklyAmountsChart v-if="selectedStat === 1" class="flex-1" />
  <WeeklyCategoriesChart v-if="selectedStat === 1" class="flex-1" />
  <AllTimeStatus v-if="selectedStat === 2" />
  <CategoryStatusChart
    v-if="selectedStat === 2"
    totals
    :favorites="favorites"
    :veggies="allVeggies"
  />
  <AchievementList v-if="selectedStat === 3" />
  <VeggieList :uniqueVeggies="uniqueVeggies" v-if="selectedStat === 4" />
</template>
<style lang="scss" scoped>
.stats__list-box-button {
  @apply flex items-center justify-between;
  @apply w-full button-like;
  @apply bg-sky-500;

  &:hover {
    @apply bg-sky-600;
  }
}

.stats__list-box-options {
  @apply dropdown-list-container;
}

.stats__list-box-option {
  @apply dropdown-list-option;
}
</style>
