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
import CategoryStatus from '@/components/CategoryStatus.vue';
import AchievementList from '@/components/AchievementList.vue';

const activityStore = useActivityStore();
const {currentVeggies, allVeggies} = storeToRefs(activityStore);
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
  <Listbox v-model="selectedStat" class="relative z-10 uppercase" as="div">
    <div class="flex-container flex-col">
      <ListboxLabel class="text-xs">{{ $t('stats.chosenStats') }}</ListboxLabel>
      <ListboxButton class="stats__list-box-button">
        <span class="truncate">{{ $t(`stats.${selectedStat}`) }}</span>
        <IconComponent icon="chevron" />
      </ListboxButton>
    </div>
    <Transition
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <ListboxOptions class="stats__list-box-options">
        <ListboxOption
          v-slot="{active, selected}"
          as="template"
          v-for="item in [0, 1, 2, 3]"
          :key="item"
          :value="item"
        >
          <li
            :class="[getOptionClasses(active, selected), 'stats__list-box-option']"
            role="menuitem"
          >
            {{ $t(`stats.${item}`) }}
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
  <WeeklyAmountsChart v-if="selectedStat === 1" />
  <WeeklyCategoriesChart v-if="selectedStat === 1" />
  <AllTimeStatus v-if="selectedStat === 2" />
  <CategoryStatus v-if="selectedStat === 2" totals :veggies="allVeggies" />
  <AchievementList v-if="selectedStat === 3" />
</template>
<style lang="scss" scoped>
.stats__list-box-button {
  letter-spacing: 1px;
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
