<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {AchievementLevel, Category} from '@/utils/types';
import {useAppStateStore} from '@/stores/appStateStore';
import AchievementBadge from '@/components/AchievementBadge.vue';

const {achievements} = storeToRefs(useAppStateStore());
</script>
<template>
  <div class="achievement-list" data-test-id="achievement-list">
    <div>
      <p class="achievement-list__label">{{ $t('achievements.thirtyVeggies.title') }}</p>
      <div class="achievement-list__badge-container">
        <AchievementBadge
          :active="achievements.thirtyVeggies >= AchievementLevel.Gold"
          :level="AchievementLevel.Gold"
          achievement="thirtyVeggies"
        />
      </div>
    </div>
    <div>
      <p class="achievement-list__label">{{ $t('achievements.completionist.title') }}</p>
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
    </div>
    <div>
      <p class="achievement-list__label">{{ $t('achievements.challengeAccepted.title') }}</p>
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
    </div>
    <div>
      <p class="achievement-list__label">{{ $t('achievements.committed.title') }}</p>
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
    </div>
    <div>
      <p class="achievement-list__label">{{ $t('achievements.hotStreak.title') }}</p>
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
    </div>
    <div>
      <p class="achievement-list__label">{{ $t('achievements.experimenterFruit.title') }}</p>
      <div class="achievement-list__badge-container">
        <AchievementBadge
          v-for="category in Category"
          :key="category"
          :level="AchievementLevel.Gold"
          :achievement="`experimenter${category}`"
          :active="achievements[`experimenter${category}`] === AchievementLevel.Gold"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.achievement-list {
  @apply has-scroll;
  @apply flex flex-col gap-6;
}

.achievement-list__badge-container {
  @apply px-2;
  @apply flex-container justify-evenly flex-wrap;
}

.achievement-list__label {
  @apply label-like mb-2;
}
</style>
