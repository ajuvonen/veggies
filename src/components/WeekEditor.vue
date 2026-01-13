<script lang="ts" setup>
import {computed, provide, readonly, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useActivityStore} from '@/stores/activityStore';
import {KEYS} from '@/utils/constants';
import {AchievementLevel, type Achievements} from '@/types';
import {useDateTime} from '@/hooks/dateTime';
import {useAchievementCompletion} from '@/hooks/achievementCompletion';
import TagsComponent from '@/components/TagsComponent.vue';
import VeggieSearch from '@/components/VeggieSearch.vue';
import AchievementBadge from '@/components/AchievementBadge.vue';
import DropdownList from '@/components/ui/DropdownList.vue';

const activityStore = useActivityStore();
const {getWeekStarts, veggiesForWeek, challenges, weeklyAchievements} = storeToRefs(activityStore);
const {toggleVeggieForWeek, setVeggiesForWeek} = activityStore;

const selectedWeekStart = ref(getWeekStarts.value[0]!);

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
</script>
<template>
  <div class="week-editor" data-test-id="week-editor">
    <DropdownList
      v-model="selectedWeekStart"
      :options="getWeekStarts"
      :label="$t('stats.editWeek')"
      :keyFn="(date) => date.toISODate()"
      prefix="week-editor"
    >
      <template #selected="{item: date}">
        <time :datetime="date.toFormat(`yyyy-'W'WW`)" class="truncate">
          {{ formatWeekString(date) }}
        </time>
      </template>
      <template #option="{item: date}">
        <time :datetime="date.toFormat(`yyyy-'W'WW`)" class="truncate">
          {{ formatWeekString(date) }}
        </time>
      </template>
    </DropdownList>
    <VeggieSearch v-model="veggies" />
    <ul
      class="flex-container flex-wrap justify-center"
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
    />
  </div>
</template>
