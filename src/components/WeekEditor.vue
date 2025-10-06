<script lang="ts" setup>
import {computed, inject, provide, readonly, ref, useTemplateRef} from 'vue';
import {storeToRefs} from 'pinia';
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
import {AchievementLevel, type Achievements} from '@/utils/types';
import {useScreen} from '@/hooks/screen';
import {useDateTime} from '@/hooks/dateTime';
import {useAchievementCompletion} from '@/hooks/achievementCompletion';
import TagsComponent from '@/components/TagsComponent.vue';
import VeggieSearch from '@/components/VeggieSearch.vue';
import AchievementBadge from '@/components/AchievementBadge.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';

defineEmits(['scroll']);

const activityStore = useActivityStore();
const {getWeekStarts, veggiesForWeek, challenges, weeklyAchievements} = storeToRefs(activityStore);
const {toggleVeggieForWeek, setVeggiesForWeek} = activityStore;

const selectedWeekStart = ref(getWeekStarts.value[0]!);

const optionsElement = useTemplateRef('optionsElement');
const {maxHeight} = useScreen(optionsElement);

const veggies = computed({
  get: () => veggiesForWeek.value(selectedWeekStart.value),
  set: (veggies) => setVeggiesForWeek(veggies, selectedWeekStart.value),
});

const {formatWeekString} = useDateTime();

const selectedChallenge = computed(
  () => challenges.value.find(({startDate}) => startDate.equals(selectedWeekStart.value))?.veggie,
);

const {weeklyCompletion} = useAchievementCompletion(veggies, selectedChallenge);

provide(KEYS.challenge, readonly(selectedChallenge));
const getDropdownStyles = inject(KEYS.dropdownStyles);
</script>
<template>
  <div class="week-editor" data-test-id="week-editor">
    <Listbox v-model="selectedWeekStart" class="relative z-30" as="div" v-slot="{open}">
      <ContentElement :title="$t('stats.editWeek')" :labelTag="ListboxLabel">
        <ListboxButton
          :as="ButtonComponent"
          class="justify-between"
          data-test-id="week-editor-dropdown-button"
        >
          <time :datetime="selectedWeekStart.toFormat(`yyyy'W'WW`)" class="truncate">{{
            formatWeekString(selectedWeekStart)
          }}</time>
          <IconComponent :class="open ? 'rotate-180 transform' : ''" icon="chevronDown" />
        </ListboxButton>
      </ContentElement>
      <TransitionRoot
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          ref="optionsElement"
          :style="`max-height: calc(${maxHeight}px - 1rem)`"
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
              <time :datetime="date.toFormat(`yyyy'W'WW`)" class="truncate">{{
                formatWeekString(date)
              }}</time>
              <IconComponent v-if="selected" icon="check" />
            </li>
          </ListboxOption>
        </ListboxOptions>
      </TransitionRoot>
    </Listbox>
    <VeggieSearch v-model="veggies" />
    <ul
      class="flex-container flex-wrap justify-evenly"
      :aria-label="$t('stats.weeklyAchievements')"
    >
      <AchievementBadge
        v-for="[achievement, level] in Object.entries(
          weeklyAchievements(veggies, selectedWeekStart),
        )"
        :key="achievement"
        :achievement="achievement as keyof Achievements"
        :level="level || AchievementLevel.Gold"
        :active="level >= AchievementLevel.Gold"
        :degree="weeklyCompletion[achievement as keyof Achievements]"
        noLabel
      />
    </ul>
    <TagsComponent
      :veggies="veggies"
      :variant="['tag', 'remove']"
      :toggleFn="(veggie) => toggleVeggieForWeek(veggie, selectedWeekStart)"
      :ariaLabel="$t('stats.veggiesForWeek')"
      ariaTagKey="general.clickToRemove"
      icon="minus"
      @scroll="$emit('scroll')"
    />
  </div>
</template>
