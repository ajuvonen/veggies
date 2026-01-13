<script setup lang="ts">
import {ref, watch} from 'vue';
import {storeToRefs} from 'pinia';
import {omitBy} from 'remeda';
import {AchievementLevel, type Achievements} from '@/types';
import {useActivityStore} from '@/stores/activityStore';
import AchievementBadge from '@/components/AchievementBadge.vue';

const {achievements} = storeToRefs(useActivityStore());

const newAchievements = ref({} as Partial<Achievements>);
const dialogOpen = ref(false);

watch(achievements, async (newValue, oldValue) => {
  newAchievements.value = omitBy(
    newValue,
    (value, key) => value === AchievementLevel.NoAchievement || oldValue[key] >= value,
  );
  if (Object.keys(newAchievements.value).length) {
    const {default: confetti} = await import('canvas-confetti');
    dialogOpen.value = true;
    confetti({
      disableForReducedMotion: true,
      particleCount: 150,
      spread: 70,
      origin: {x: 0.5, y: 0.7},
    });
  }
});
</script>
<template>
  <ModalDialog
    id="achievement-dialog"
    v-model="dialogOpen"
    :title="$t('achievements.newAchievements')"
  >
    <template #content>
      <ul class="achievement-container">
        <li v-for="(value, key) in newAchievements" :key="key" class="flex-container flex-col">
          <AchievementBadge as="div" active :achievement="key" :level="value!" />
          <p class="text-center">{{ $t(`achievements.${key}.${value}`) }}</p>
        </li>
      </ul>
    </template>
  </ModalDialog>
</template>
<style scoped>
.achievement-container {
  @apply flex flex-col gap-4;
  @apply text-sm;
}
</style>
