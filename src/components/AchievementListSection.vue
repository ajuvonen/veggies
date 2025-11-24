<script setup lang="ts">
import {AchievementLevel, type Achievements} from '@/utils/types';
import AchievementBadge from '@/components/AchievementBadge.vue';

defineProps<{
  achievement: keyof Achievements;
  achievementLevel: AchievementLevel;
}>();
</script>
<template>
  <ContentElement :title="$t(`achievements.${achievement}.title`)">
    <ul class="achievement-list__badge-container">
      <AchievementBadge
        :active="achievementLevel >= AchievementLevel.Bronze"
        :level="AchievementLevel.Bronze"
        :achievement="achievement"
      />
      <AchievementBadge
        :active="achievementLevel >= AchievementLevel.Silver"
        :level="AchievementLevel.Silver"
        :achievement="achievement"
      />
      <AchievementBadge
        :active="achievementLevel >= AchievementLevel.Gold"
        :level="AchievementLevel.Gold"
        :achievement="achievement"
      />
    </ul>
  </ContentElement>
</template>
