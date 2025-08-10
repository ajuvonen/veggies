<script setup lang="ts">
import {AchievementLevel, Category, type Achievements} from '@/utils/types';
import AchievementBadge from '@/components/AchievementBadge.vue';

defineProps<{
  achievements: Achievements;
}>();
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
          :active="achievements.goNuts === AchievementLevel.Gold"
          :level="AchievementLevel.Gold"
          achievement="goNuts"
        />
        <AchievementBadge
          :active="achievements.lemons === AchievementLevel.Gold"
          :level="AchievementLevel.Gold"
          achievement="lemons"
        />
        <AchievementBadge
          :active="achievements.allOnRed === AchievementLevel.Gold"
          :level="AchievementLevel.Gold"
          achievement="allOnRed"
        />
        <AchievementBadge
          :active="achievements.botanicalBerries === AchievementLevel.Gold"
          :level="AchievementLevel.Gold"
          achievement="botanicalBerries"
        />
        <AchievementBadge
          :active="achievements.rainbow === AchievementLevel.Gold"
          :level="AchievementLevel.Gold"
          achievement="rainbow"
        />
        <AchievementBadge
          :active="achievements.thirtyVeggies >= AchievementLevel.Gold"
          :level="AchievementLevel.Gold"
          achievement="thirtyVeggies"
        />
        <AchievementBadge
          v-if="achievements.thirtyVeggies === AchievementLevel.Platinum"
          :active="true"
          :level="AchievementLevel.Platinum"
          achievement="thirtyVeggies"
        />
      </ul>
    </ContentElement>
    <ContentElement :title="$t('achievements.completionist.title')">
      <ul class="achievement-list__badge-container">
        <AchievementBadge
          :active="achievements.completionist >= AchievementLevel.Bronze"
          :level="AchievementLevel.Bronze"
          achievement="completionist"
        />
        <AchievementBadge
          :active="achievements.completionist >= AchievementLevel.Silver"
          :level="AchievementLevel.Silver"
          achievement="completionist"
        />
        <AchievementBadge
          :active="achievements.completionist >= AchievementLevel.Gold"
          :level="AchievementLevel.Gold"
          achievement="completionist"
        />
      </ul>
    </ContentElement>
    <ContentElement :title="$t('achievements.challengeAccepted.title')">
      <ul class="achievement-list__badge-container">
        <AchievementBadge
          :active="achievements.challengeAccepted >= AchievementLevel.Bronze"
          :level="AchievementLevel.Bronze"
          achievement="challengeAccepted"
        />
        <AchievementBadge
          :active="achievements.challengeAccepted >= AchievementLevel.Silver"
          :level="AchievementLevel.Silver"
          achievement="challengeAccepted"
        />
        <AchievementBadge
          :active="achievements.challengeAccepted >= AchievementLevel.Gold"
          :level="AchievementLevel.Gold"
          achievement="challengeAccepted"
        />
      </ul>
    </ContentElement>
    <ContentElement :title="$t('achievements.committed.title')">
      <ul class="achievement-list__badge-container">
        <AchievementBadge
          :active="achievements.committed >= AchievementLevel.Bronze"
          :level="AchievementLevel.Bronze"
          achievement="committed"
        />
        <AchievementBadge
          :active="achievements.committed >= AchievementLevel.Silver"
          :level="AchievementLevel.Silver"
          achievement="committed"
        />
        <AchievementBadge
          :active="achievements.committed >= AchievementLevel.Gold"
          :level="AchievementLevel.Gold"
          achievement="committed"
        />
      </ul>
    </ContentElement>
    <ContentElement :title="$t('achievements.hotStreak.title')">
      <ul class="achievement-list__badge-container">
        <AchievementBadge
          :active="achievements.hotStreak >= AchievementLevel.Bronze"
          :level="AchievementLevel.Bronze"
          achievement="hotStreak"
        />
        <AchievementBadge
          :active="achievements.hotStreak >= AchievementLevel.Silver"
          :level="AchievementLevel.Silver"
          achievement="hotStreak"
        />
        <AchievementBadge
          :active="achievements.hotStreak >= AchievementLevel.Gold"
          :level="AchievementLevel.Gold"
          achievement="hotStreak"
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
  </div>
</template>
<style scoped>
.achievement-list__badge-container {
  @apply px-2;
  @apply flex-container justify-evenly flex-wrap;
}
</style>
