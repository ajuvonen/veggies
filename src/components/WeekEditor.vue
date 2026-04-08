<script lang="ts" setup>
import {computed, provide, readonly, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useActivityStore} from '@/stores/activityStore';
import {KEYS} from '@/utils/constants';
import {areDatesEqual} from '@/utils/helpers';
import {AchievementLevel, type Achievements} from '@/types';
import {useDateTime} from '@/hooks/dateTime';
import {useAchievementCompletion} from '@/hooks/achievementCompletion';

const activityStore = useActivityStore();
const {getWeekStarts, veggiesForWeek, challengeForWeek, weeklyAchievements} =
  storeToRefs(activityStore);
const {toggleVeggieForWeek, setVeggiesForWeek} = activityStore;

const selectedWeekStart = ref(getWeekStarts.value[0]!);

const veggies = computed({
  get: () => veggiesForWeek.value(selectedWeekStart.value),
  set: (veggies) => setVeggiesForWeek(veggies, selectedWeekStart.value),
});

const {formatWeekString} = useDateTime();

const selectedChallenge = computed(() => challengeForWeek.value(selectedWeekStart.value));

const {weeklyCompletion} = useAchievementCompletion(veggies, selectedChallenge);

provide(KEYS.challenge, readonly(selectedChallenge));
</script>
<template>
  <DropdownList
    v-model="selectedWeekStart"
    :options="getWeekStarts"
    :label="$t('stats.editWeek')"
    :keyFn="(date) => date.toString()"
    :by="areDatesEqual"
    prefix="week-editor"
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
      v-for="[achievement, level] in Object.entries(weeklyAchievements(veggies, selectedWeekStart))"
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
</template>
