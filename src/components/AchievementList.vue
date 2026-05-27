<script setup lang="ts">
import {AchievementLevel, Category, type Achievements} from '@/types';
import {useAvailableWeeklyAchievements} from '@/hooks/availableWeeklyAchievements';

defineProps<{
  achievements: Achievements;
}>();

const {availableWeeklyAchievements} = useAvailableWeeklyAchievements();

const standardAchievements: (keyof Achievements)[] = [
  'completionist',
  'challengeAccepted',
  'committed',
  'hotStreak',
];
</script>
<template>
  <ContentElement
    v-if="achievements.thousandsOdd !== achievements.thousandsEven"
    :title="$t('achievements.thousandsOdd.title')"
    data-test-id="thousands-container"
  >
    <ul class="achievement-list__badge-container">
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
    </ul>
  </ContentElement>
  <ContentElement :title="$t('achievements.thirtyVeggies.title')">
    <ul class="achievement-list__badge-container">
      <AchievementBadge
        v-for="achievement in availableWeeklyAchievements"
        :key="achievement"
        :active="achievements[achievement] >= AchievementLevel.Gold"
        :level="Math.max(AchievementLevel.Gold, achievements[achievement])"
        :achievement="achievement"
      />
    </ul>
  </ContentElement>
  <ContentElement
    v-for="achievement in standardAchievements"
    :key="achievement"
    :title="$t(`achievements.${achievement}.title`)"
  >
    <ul class="achievement-list__badge-container">
      <AchievementBadge
        :active="achievements[achievement] >= AchievementLevel.Bronze"
        :level="AchievementLevel.Bronze"
        :achievement="achievement"
      />
      <AchievementBadge
        :active="achievements[achievement] >= AchievementLevel.Silver"
        :level="AchievementLevel.Silver"
        :achievement="achievement"
      />
      <AchievementBadge
        :active="achievements[achievement] >= AchievementLevel.Gold"
        :level="AchievementLevel.Gold"
        :achievement="achievement"
      />
    </ul>
  </ContentElement>
  <ContentElement :title="$t('achievements.experimenterFruit.title')">
    <ul class="achievement-list__badge-container">
      <AchievementBadge
        v-for="category in Category"
        :key="category"
        :level="AchievementLevel.Gold"
        :achievement="`experimenter${category}`"
        :active="achievements[`experimenter${category}`] === AchievementLevel.Gold"
      />
    </ul>
  </ContentElement>
</template>
<style scoped>
:deep(.achievement-list__badge-container) {
  @apply px-2;
  @apply flex-container justify-evenly flex-wrap;
}
</style>
