<script lang="ts" setup>
import {ref} from 'vue';
import {storeToRefs} from 'pinia';
import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from '@headlessui/vue';
import {useActivityStore} from '@/stores/activityStore';
import TagsComponent from '@/components/TagsComponent.vue';
import WeeklyAmountsChart from '@/components/charts/WeeklyAmountsChart.vue';
import {COLORS} from '@/utils/constants';

const activityStore = useActivityStore();
const {currentveggies} = storeToRefs(activityStore);
const {toggleVeggie} = activityStore;

const selectedStat = ref(0);

const getOptionClasses = (active: boolean, selected: boolean) => {
  const textClass = active ? `text-[${COLORS.offWhite}]` : 'text-slate-900';
  let bgClass = 'transparent';
  if (active) {
    bgClass = 'bg-sky-500';
  } else if (selected) {
    bgClass = 'bg-sky-200';
  }
  return `${textClass} ${bgClass}`;
};
</script>
<template>
  <Listbox v-model="selectedStat" class="relative w-full max-w-lg z-10" as="div">
    <ListboxButton class="stats__list-box-button">
      <span class="block truncate">{{ $t(`stats.${selectedStat}`) }}</span>
      <IconComponent icon="chevron" />
    </ListboxButton>
    <Transition
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <ListboxOptions class="stats__list-box-options">
        <ListboxOption v-slot="{active, selected}" v-for="item in [0, 1]" :key="item" :value="item">
          <li :class="[getOptionClasses(active, selected), 'stats__list-box-option']">
            {{ $t(`stats.${item}`) }}
          </li>
        </ListboxOption>
      </ListboxOptions>
    </Transition>
  </Listbox>
  <div class="w-full h-full">
    <TagsComponent
      v-if="selectedStat === 0"
      :items="currentveggies"
      :variant="['tag', 'danger']"
      @click="toggleVeggie"
    >
      <template #item="{item}">
        <IconComponent icon="minus" />
        <span
          :aria-label="$t(`general.clickToRemove`, [$t(`veggies.${item}`)])"
          :title="$t(`general.clickToRemove`, [$t(`veggies.${item}`)])"
          >{{ $t(`veggies.${item}`) }}</span
        >
      </template>
    </TagsComponent>
    <WeeklyAmountsChart v-if="selectedStat === 1" />
  </div>
</template>
<style lang="scss" scoped>
.stats__list-box-button {
  letter-spacing: 1px;
  @apply flex items-center justify-between;
  @apply w-full button-like;
  @apply bg-sky-400;

  &:hover {
    @apply bg-sky-500;
  }
}

.stats__list-box-options {
  @apply dropdown-list-container;
}

.stats__list-box-option {
  @apply dropdown-list-option;
}
</style>
