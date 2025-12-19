<script setup lang="ts">
import {AchievementLevel, Category, type Achievements} from '@/types';
import AchievementBadge from '@/components/AchievementBadge.vue';
import AchievementListSection from '@/components/AchievementListSection.vue';

defineProps<{
  achievements: Achievements;
}>();

const weeklyAchievements: (keyof Achievements)[] = [
  'goNuts',
  'lemons',
  'tearnado',
  'allOnRed',
  'botanicalBerries',
  'overachiever',
  'rainbow',
];

const standardAchievements: (keyof Achievements)[] = [
  'completionist',
  'challengeAccepted',
  'committed',
  'hotStreak',
];
</script>
<template>
  <div class="has-scroll m-0 p-0" data-test-id="achievement-list">
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
          v-for="achievement in weeklyAchievements"
          :key="achievement"
          :active="achievements[achievement] === AchievementLevel.Gold"
          :level="AchievementLevel.Gold"
          :achievement="achievement"
        />
        <AchievementBadge
          :active="achievements.thirtyVeggies >= AchievementLevel.Gold"
          :level="achievements.thirtyVeggies || AchievementLevel.Gold"
          achievement="thirtyVeggies"
        />
      </ul>
    </ContentElement>
    <AchievementListSection
      v-for="achievement in standardAchievements"
      :key="achievement"
      :achievement="achievement"
      :achievementLevel="achievements[achievement]"
    />
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
  </div>
</template>
<style scoped>
:deep(.achievement-list__badge-container) {
  @apply px-2;
  @apply flex-container justify-evenly flex-wrap;
}
</style>
