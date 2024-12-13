<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {AchievementLevel, Category} from '@/utils/types';
import {useAppStateStore} from '@/stores/appStateStore';
import AchievementBadge from '@/components/AchievementBadge.vue';

const {achievements} = storeToRefs(useAppStateStore());
</script>
<template>
  <div class="achievement-list" data-test-id="achievement-list">
    <ContentElement :title="$t('achievements.thirtyVeggies.title')">
      <div class="achievement-list__badge-container">
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
      </div>
    </ContentElement>
    <ContentElement :title="$t('achievements.completionist.title')">
      <div class="achievement-list__badge-container">
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
      </div>
    </ContentElement>
    <ContentElement :title="$t('achievements.challengeAccepted.title')">
      <div class="achievement-list__badge-container">
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
      </div>
    </ContentElement>
    <ContentElement :title="$t('achievements.committed.title')">
      <div class="achievement-list__badge-container">
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
      </div>
    </ContentElement>
    <ContentElement :title="$t('achievements.hotStreak.title')">
      <div class="achievement-list__badge-container">
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
      </div>
    </ContentElement>
    <ContentElement :title="$t('achievements.favorite.title')">
      <div class="achievement-list__badge-container">
        <AchievementBadge
          :active="achievements.favorite >= AchievementLevel.Bronze"
          :level="AchievementLevel.Bronze"
          achievement="favorite"
        />
        <AchievementBadge
          :active="achievements.favorite >= AchievementLevel.Silver"
          :level="AchievementLevel.Silver"
          achievement="favorite"
        />
        <AchievementBadge
          :active="achievements.favorite >= AchievementLevel.Gold"
          :level="AchievementLevel.Gold"
          achievement="favorite"
        />
      </div>
    </ContentElement>
    <ContentElement :title="$t('achievements.experimenterFruit.title')">
      <div class="achievement-list__badge-container">
        <AchievementBadge
          v-for="category in Category"
          :key="category"
          :level="AchievementLevel.Gold"
          :achievement="`experimenter${category}`"
          :active="achievements[`experimenter${category}`] === AchievementLevel.Gold"
        />
      </div>
    </ContentElement>
  </div>
</template>
<style lang="scss" scoped>
.achievement-list {
  @apply has-scroll m-0 p-0;
  @apply flex flex-col gap-6;
}

.achievement-list__badge-container {
  @apply px-2;
  @apply flex-container justify-evenly flex-wrap;
}
</style>
