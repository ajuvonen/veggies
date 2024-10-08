<script setup lang="ts">
import {CATEGORY_EMOJI} from '@/utils/constants';
import {AchievementLevel, type Achievements} from '@/utils/types';

defineProps<{
  achievement: keyof Achievements;
  level: AchievementLevel;
  active: boolean;
}>();

type AchievementProps = Record<
  keyof Achievements,
  Partial<
    Record<
      AchievementLevel,
      {
        textProps: (string | number)[];
        emoji: string;
      }
    >
  >
>;

const achievementProps: AchievementProps = {
  challengeAccepted: {
    [AchievementLevel.Bronze]: {
      textProps: [5],
      emoji: '🛴',
    },
    [AchievementLevel.Silver]: {
      textProps: [10],
      emoji: '🛵',
    },
    [AchievementLevel.Gold]: {
      textProps: [20],
      emoji: '🚀',
    },
  },
  committed: {
    [AchievementLevel.Bronze]: {
      textProps: [3],
      emoji: '🌱',
    },
    [AchievementLevel.Silver]: {
      textProps: [6],
      emoji: '🪴',
    },
    [AchievementLevel.Gold]: {
      textProps: [12],
      emoji: '🎄',
    },
  },
  completionist: {
    [AchievementLevel.Bronze]: {
      textProps: [40],
      emoji: '🐣',
    },
    [AchievementLevel.Silver]: {
      textProps: [80],
      emoji: '🐧',
    },
    [AchievementLevel.Gold]: {
      textProps: [150],
      emoji: '🦅',
    },
  },
  hotStreak: {
    [AchievementLevel.Bronze]: {
      textProps: [5],
      emoji: '🌶️',
    },
    [AchievementLevel.Silver]: {
      textProps: [10],
      emoji: '🔥',
    },
    [AchievementLevel.Gold]: {
      textProps: [20],
      emoji: '🌋',
    },
  },
  experimenterBean: {
    [AchievementLevel.Gold]: {
      textProps: [15],
      emoji: CATEGORY_EMOJI.Bean,
    },
  },
  experimenterFruit: {
    [AchievementLevel.Gold]: {
      textProps: [15],
      emoji: CATEGORY_EMOJI.Fruit,
    },
  },
  experimenterGrain: {
    [AchievementLevel.Gold]: {
      textProps: [15],
      emoji: CATEGORY_EMOJI.Grain,
    },
  },
  experimenterLeafy: {
    [AchievementLevel.Gold]: {
      textProps: [15],
      emoji: CATEGORY_EMOJI.Leafy,
    },
  },
  experimenterRoot: {
    [AchievementLevel.Gold]: {
      textProps: [15],
      emoji: CATEGORY_EMOJI.Root,
    },
  },
  experimenterVegetable: {
    [AchievementLevel.Gold]: {
      textProps: [15],
      emoji: CATEGORY_EMOJI.Vegetable,
    },
  },
  thirtyVeggies: {
    [AchievementLevel.Gold]: {
      textProps: [],
      emoji: '🎉',
    },
  },
};
</script>
<template>
  <div
    :aria-disabled="!active"
    :title="
      $t(`achievements.${achievement}.ariaLabel`, achievementProps[achievement][level]!.textProps)
    "
    :aria-label="
      $t(`achievements.${achievement}.ariaLabel`, achievementProps[achievement][level]!.textProps)
    "
    :data-test-id="`badge-${achievement}-${level}`"
    class="badge"
    role="img"
  >
    <div
      class="badge__background"
      :class="[`badge__background--${AchievementLevel[level]}`]"
      aria-hidden="true"
    >
      <div class="badge__emoji">
        {{ achievementProps[achievement][level]!.emoji }}
      </div>
    </div>
    <div aria-hidden="true" class="badge__text">
      {{
        $t(`achievements.${achievement}.badgeText`, achievementProps[achievement][level]!.textProps)
      }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.badge {
  @apply relative select-none aspect-square self-center;
  filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.3));
  flex: 0 0 calc(33% - 5px);

  &[aria-disabled='true'] {
    opacity: 0.5;
  }
}

.badge__background {
  @apply relative w-full h-full rounded-full border-4 overflow-hidden text-[17cqmin] sm:text-[14cqmin];
  @apply flex items-center justify-center;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.3);
  text-shadow: 1px 1px 1px #334155;
}

.badge__emoji {
  mix-blend-mode: luminosity;
}

.badge__text {
  @apply absolute bottom-[3cqmin] min-w-full text-nowrap rounded-md text-center label-like;
  @apply bg-slate-700 text-slate-50;
}

.badge__background--Bronze {
  background: linear-gradient(135deg, #cd7f32, #b87333);
  border-color: #d48b47;
}

.badge__background--Silver {
  background: linear-gradient(135deg, #c0c0c0, #a9a9a9);
  border-color: #c9c9c9;
}

.badge__background--Gold {
  background: linear-gradient(135deg, #d4af37, #b89b36, #8c7d33);
  border-color: #d9b43b;
}

.badge__background::after {
  content: '';
  @apply absolute top-0 left-0 w-full h-full rounded-full;
  background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.5), transparent);
  mask-image: radial-gradient(circle, white 30%, transparent 60%);
  mask-size: 150%;
  mask-position: 30% 30%;
}

.badge__background::before {
  content: '';
  @apply absolute w-full h-full rounded-full border-2 border-dotted border-inherit;
}
</style>
