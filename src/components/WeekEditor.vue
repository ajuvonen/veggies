<script lang="ts" setup>
import {computed, provide, readonly, shallowRef} from 'vue';
import {storeToRefs} from 'pinia';
import {entries} from 'remeda';
import {useActivityStore} from '@/stores/activityStore';
import {KEYS} from '@/utils/constants';
import {areDatesEqual} from '@/utils/helpers';
import {AchievementLevel} from '@/types';
import {useAvailableWeeklyAchievements} from '@/hooks/availableWeeklyAchievements';
import {useDateTime} from '@/hooks/dateTime';
import {useAchievementCompletion} from '@/hooks/achievementCompletion';

const activityStore = useActivityStore();
const {getWeekStarts, veggiesForWeek, challengeForWeek, weeklyAchievements} =
  storeToRefs(activityStore);
const {toggleVeggieForWeek, setVeggiesForWeek} = activityStore;

const selectedWeekStart = shallowRef(getWeekStarts.value[0]!);

const veggies = computed({
  get: () => veggiesForWeek.value(selectedWeekStart.value),
  set: (veggies) => setVeggiesForWeek(veggies, selectedWeekStart.value),
});

const {formatWeekString} = useDateTime();

const selectedChallenge = computed(() => challengeForWeek.value(selectedWeekStart.value));

const {weeklyCompletion} = useAchievementCompletion(veggies, selectedChallenge);
const {availableWeeklyAchievements} = useAvailableWeeklyAchievements();

const displayedWeeklyAchievements = computed(() =>
  entries(weeklyAchievements.value(veggies.value, selectedWeekStart.value)).filter(([key]) =>
    availableWeeklyAchievements.value.includes(key),
  ),
);

provide(KEYS.challenge, readonly(selectedChallenge));
</script>
<template>
  <DropdownList
    v-model="selectedWeekStart"
    id="week-editor"
    :label="$t('stats.editWeek')"
    :options="getWeekStarts"
    :keyFn="(date) => date.toString()"
    :by="areDatesEqual"
  >
    <template #option="{item: date}">
      <time
        :datetime="`${date.yearOfWeek}-W${String(date.weekOfYear).padStart(2, '0')}`"
        class="truncate"
      >
        {{ formatWeekString(date) }}
      </time>
    </template>
  </DropdownList>
  <VeggieSearch v-model="veggies" />
  <ul class="flex-container flex-wrap justify-center" :aria-label="$t('stats.weeklyAchievements')">
    <AchievementBadge
      v-for="[achievement, level] in displayedWeeklyAchievements"
      :key="achievement"
      :achievement="achievement"
      :level="level || AchievementLevel.Gold"
      :active="level >= AchievementLevel.Gold"
      :degree="weeklyCompletion[achievement]"
      noLabel
    />
  </ul>
  <TagsComponent
    :veggies="veggies"
    :toggleFn="(veggie) => toggleVeggieForWeek(veggie, selectedWeekStart)"
    :ariaLabel="$t('stats.veggiesForWeek')"
    ariaTagKey="general.clickToRemove"
    color="selected"
    icon="minus"
  />
</template>
