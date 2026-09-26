<script setup lang="ts">
import {AchievementLevel, Category, type Achievements} from '@/types';
import {useAvailableWeeklyAchievements} from '@/hooks/availableWeeklyAchievements';

defineProps<{
  achievements: Achievements;
}>();

const {availableWeeklyAchievements} = useAvailableWeeklyAchievements();

const standardAchievements = [
  'completionist',
  'challengeAccepted',
  'committed',
  'hotStreak',
] as const satisfies ReadonlyArray<keyof Achievements>;
</script>
<template>
  <ContentElement
    v-if="achievements.thousandsOdd !== achievements.thousandsEven"
    :label="$t('achievements.thousandsOdd.title')"
    data-test-id="thousands-container"
  >
    <ul class="achievement-list__badge-container">
      <li>
        <AchievementBadge
          v-if="achievements.thousandsOdd === AchievementLevel.Platinum"
          :active="true"
          :level="AchievementLevel.Platinum"
          achievement="thousandsOdd"
          data-test-id="thousands-odd-achievement"
        />
        <AchievementBadge
          v-if="achievements.thousandsEven === AchievementLevel.Platinum"
          :active="true"
          :level="AchievementLevel.Platinum"
          achievement="thousandsEven"
          data-test-id="thousands-even-achievement"
        />
      </li>
    </ul>
  </ContentElement>
  <ContentElement :label="$t('achievements.thirtyVeggies.title')">
    <ul class="achievement-list__badge-container">
      <li v-for="achievement in availableWeeklyAchievements" :key="achievement">
        <AchievementBadge
          :active="achievements[achievement] >= AchievementLevel.Gold"
          :level="Math.max(AchievementLevel.Gold, achievements[achievement])"
          :achievement="achievement"
        />
      </li>
    </ul>
  </ContentElement>
  <ContentElement
    v-for="achievement in standardAchievements"
    :key="achievement"
    :label="$t(`achievements.${achievement}.title`)"
  >
    <ul class="achievement-list__badge-container">
      <li>
        <AchievementBadge
          :active="achievements[achievement] >= AchievementLevel.Bronze"
          :level="AchievementLevel.Bronze"
          :achievement="achievement"
        />
      </li>
      <li>
        <AchievementBadge
          :active="achievements[achievement] >= AchievementLevel.Silver"
          :level="AchievementLevel.Silver"
          :achievement="achievement"
        />
      </li>
      <li>
        <AchievementBadge
          :active="achievements[achievement] >= AchievementLevel.Gold"
          :level="AchievementLevel.Gold"
          :achievement="achievement"
        />
      </li>
    </ul>
  </ContentElement>
  <ContentElement :label="$t('achievements.experimenterFruit.title')">
    <ul class="achievement-list__badge-container">
      <li v-for="category in Category" :key="category">
        <AchievementBadge
          :level="AchievementLevel.Gold"
          :achievement="`experimenter${category}`"
          :active="achievements[`experimenter${category}`] === AchievementLevel.Gold"
        />
      </li>
    </ul>
  </ContentElement>
</template>
<style scoped>
@reference '@/assets/main.css';

:deep(.achievement-list__badge-container) {
  @apply px-2;
  @apply cluster justify-evenly flex-wrap;
}
</style>
