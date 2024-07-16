<script lang="ts" setup>
import {computed, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from '@headlessui/vue';
import {useActivityStore} from '@/stores/activityStore';
import TagsComponent from '@/components/TagsComponent.vue';
import WeeklyAmountsChart from '@/components/charts/WeeklyAmountsChart.vue';
import {COLORS} from '@/utils/constants';

const {t, locale} = useI18n();

const activityStore = useActivityStore();
const {currentveggies} = storeToRefs(activityStore);
const {toggleVeggie} = activityStore;

const selectedStat = ref(0);

const translatedVeggies = computed(() => {
  const collator = new Intl.Collator(locale.value);
  return currentveggies.value
    .map((veggie) => ({
      veggie,
      translation: t(`veggies.${veggie}`),
    }))
    .sort((a, b) => collator.compare(a.translation, b.translation));
});

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
      :items="translatedVeggies"
      :variant="['tag', 'danger']"
      icon="minus"
      @click="toggleVeggie"
    />
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
