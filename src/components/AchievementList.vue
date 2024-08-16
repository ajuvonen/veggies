<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useActivityStore} from '@/stores/activityStore';
import AchievementBadge from '@/components/AchievementBadge.vue';
import {CATEGORY_EMOJI} from '@/utils/constants';

const {achievements} = storeToRefs(useActivityStore());
</script>
<template>
  <div class="achievement-list has-scroll">
    <div>
      <p class="achievement-list__label">{{ $t('achievements.completionist') }}</p>
      <div class="achievement-list__badge-container">
        <AchievementBadge
          :active="achievements.includes('completionistBronze')"
          :text="$t('achievements.completionistText', [40])"
          :title="$t('achievements.completionistAria', [40])"
          :aria-label="$t('achievements.completionistAria', [40])"
          role="img"
          color="bronze"
          emoji="🐣"
        />
        <AchievementBadge
          :active="achievements.includes('completionistSilver')"
          :text="$t('achievements.completionistText', [80])"
          :title="$t('achievements.completionistAria', [80])"
          :aria-label="$t('achievements.completionistAria', [80])"
          role="img"
          color="silver"
          emoji="🐥"
        />
        <AchievementBadge
          :active="achievements.includes('completionistGold')"
          :text="$t('achievements.completionistText', [150])"
          :title="$t('achievements.completionistAria', [150])"
          :aria-label="$t('achievements.completionistAria', [150])"
          role="img"
          color="gold"
          emoji="🦅"
        />
      </div>
    </div>
    <div>
      <p class="achievement-list__label">{{ $t('achievements.hotStreak') }}</p>
      <div class="achievement-list__badge-container">
        <AchievementBadge
          :active="achievements.includes('hotStreakBronze')"
          :text="$t('achievements.hotStreakText', [5])"
          :title="$t('achievements.hotStreakAria', [5])"
          :aria-label="$t('achievements.hotStreakAria', [5])"
          role="img"
          color="bronze"
          emoji="🌶️"
        />
        <AchievementBadge
          :active="achievements.includes('hotStreakSilver')"
          :text="$t('achievements.hotStreakText', [10])"
          :title="$t('achievements.hotStreakAria', [10])"
          :aria-label="$t('achievements.hotStreakAria', [10])"
          role="img"
          color="silver"
          emoji="🔥"
        />
        <AchievementBadge
          :active="achievements.includes('hotStreakGold')"
          :text="$t('achievements.hotStreakText', [20])"
          :title="$t('achievements.hotStreakAria', [20])"
          :aria-label="$t('achievements.hotStreakAria', [20])"
          role="img"
          color="gold"
          emoji="🌋"
        />
      </div>
    </div>
    <div>
      <p class="achievement-list__label">{{ $t('achievements.experimenter') }}</p>
      <div class="achievement-list__badge-container">
        <AchievementBadge
          :active="achievements.includes('experimenterFruit')"
          :text="$t('achievements.experimenterFruitText')"
          :title="$t('achievements.experimenterFruitAria', [15])"
          :aria-label="$t('achievements.experimenterFruitAria', [15])"
          :emoji="CATEGORY_EMOJI.fruit"
          role="img"
          color="gold"
        />
        <AchievementBadge
          :active="achievements.includes('experimenterVegetable')"
          :text="$t('achievements.experimenterVegetableText')"
          :title="$t('achievements.experimenterVegetableAria', [15])"
          :aria-label="$t('achievements.experimenterVegetableAria', [15])"
          :emoji="CATEGORY_EMOJI.vegetable"
          role="img"
          color="gold"
        />
        <AchievementBadge
          :active="achievements.includes('experimenterLeafy')"
          :text="$t('achievements.experimenterLeafyText')"
          :title="$t('achievements.experimenterLeafyAria', [15])"
          :aria-label="$t('achievements.experimenterLeafyAria', [15])"
          :emoji="CATEGORY_EMOJI.leafy"
          role="img"
          color="gold"
        />
        <AchievementBadge
          :active="achievements.includes('experimenterBean')"
          :text="$t('achievements.experimenterBeanText')"
          :title="$t('achievements.experimenterBeanAria', [15])"
          :aria-label="$t('achievements.experimenterBeanAria', [15])"
          :emoji="CATEGORY_EMOJI.bean"
          role="img"
          color="gold"
        />
        <AchievementBadge
          :active="achievements.includes('experimenterGrain')"
          :text="$t('achievements.experimenterGrainText')"
          :title="$t('achievements.experimenterGrainAria', [15])"
          :aria-label="$t('achievements.experimenterGrainAria', [15])"
          :emoji="CATEGORY_EMOJI.grain"
          role="img"
          color="gold"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.achievement-list {
  @apply h-full overflow-hidden overflow-y-scroll;
  @apply flex flex-col gap-8;
}

.achievement-list__badge-container {
  @apply px-2;
  @apply flex-container justify-evenly flex-wrap;
}

.achievement-list__label {
  @apply text-xs uppercase mb-2;
}
</style>
