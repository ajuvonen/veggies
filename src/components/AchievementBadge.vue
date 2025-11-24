<script setup lang="ts">
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {CATEGORY_EMOJI} from '@/utils/constants';
import {AchievementLevel, type Achievements} from '@/utils/types';

const props = withDefaults(
  defineProps<{
    achievement: keyof Achievements;
    level: AchievementLevel;
    active: boolean;
    as?: keyof HTMLElementTagNameMap;
    noLabel?: boolean;
    degree?: number;
  }>(),
  {
    as: 'li',
    noLabel: false,
    degree: 0,
  },
);

type BadgeProps = Record<
  keyof Achievements,
  Partial<
    Record<
      AchievementLevel,
      {
        readonly textProps: number[];
        readonly emoji: string;
      }
    >
  >
>;

const {t} = useI18n();

const badgeProps: BadgeProps = {
  allOnRed: {
    [AchievementLevel.Gold]: {
      textProps: [10],
      emoji: '♥️',
    },
  },
  botanicalBerries: {
    [AchievementLevel.Gold]: {
      textProps: [15],
      emoji: '🍅',
    },
  },
  challengeAccepted: {
    [AchievementLevel.Bronze]: {
      textProps: [5],
      emoji: '🚁',
    },
    [AchievementLevel.Silver]: {
      textProps: [10],
      emoji: '✈️',
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
  experimenterMushroom: {
    [AchievementLevel.Gold]: {
      textProps: [10],
      emoji: CATEGORY_EMOJI.Mushroom,
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
  goNuts: {
    [AchievementLevel.Gold]: {
      textProps: [5],
      emoji: '🥜',
    },
  },
  lemons: {
    [AchievementLevel.Gold]: {
      textProps: [5],
      emoji: '🍋',
    },
  },
  overachiever: {
    [AchievementLevel.Gold]: {
      textProps: [30],
      emoji: '💪',
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
  rainbow: {
    [AchievementLevel.Gold]: {
      textProps: [3],
      emoji: '🌈',
    },
  },
  tearnado: {
    [AchievementLevel.Gold]: {
      textProps: [5],
      emoji: '🧅',
    },
  },
  thirtyVeggies: {
    [AchievementLevel.Gold]: {
      textProps: [30],
      emoji: '🎉',
    },
    [AchievementLevel.Platinum]: {
      textProps: [40],
      emoji: '💎',
    },
  },
  thousandsOdd: {
    [AchievementLevel.Platinum]: {
      emoji: '🐐',
      textProps: [],
    },
  },
  thousandsEven: {
    [AchievementLevel.Platinum]: {
      emoji: '🐐',
      textProps: [],
    },
  },
};

const labelSuffix = computed(() => {
  if (props.active) {
    return undefined;
  }

  return props.degree
    ? t('achievements.partial', [Math.round((props.degree / 360) * 100)])
    : t('achievements.locked');
});
</script>
<template>
  <Component
    v-tippy="{
      content: $t(`achievements.${achievement}.ariaLabel`, [
        ...badgeProps[achievement][level]!.textProps,
        labelSuffix,
      ]),
      aria: {
        content: null,
        expanded: false,
      },
    }"
    :is="as"
    :aria-label="
      $t(`achievements.${achievement}.ariaLabel`, [
        ...badgeProps[achievement][level]!.textProps,
        labelSuffix,
      ])
    "
    :data-test-id="`badge-${achievement}-${level}`"
    :class="[`badge--${achievement}`, {'badge--noLabel': noLabel, 'badge--locked': !active}]"
    class="badge"
    role="img"
  >
    <div
      class="badge__background"
      :class="[`badge__background--${AchievementLevel[level]}`]"
      aria-hidden="true"
    >
      <div class="badge__emoji">
        {{ badgeProps[achievement][level]!.emoji }}
      </div>
    </div>
    <div
      v-if="!active"
      class="badge__overlay"
      :style="`mask-image: conic-gradient(transparent 0deg ${degree}deg, black ${degree}deg 360deg)`"
    ></div>
    <div v-if="!noLabel" aria-hidden="true" class="badge__text">
      {{ $t(`achievements.${achievement}.badgeText`, badgeProps[achievement][level]!.textProps) }}
    </div>
  </Component>
</template>
<style scoped>
.badge {
  @apply relative select-none aspect-square self-center max-w-32;
  filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.3));
  &:not(.badge--noLabel) {
    flex: 0 0 calc(33% - 5px);
  }
}

.badge__background {
  @apply relative w-full h-full rounded-full border-4 overflow-hidden text-[17cqmin] sm:text-[12cqmin];
  @apply flex items-center justify-center;
  .badge--noLabel > & {
    @apply text-3xl p-[0.125rem];
  }
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.3);
  text-shadow: 1px 1px 1px #334155;
}

.badge__overlay {
  @apply absolute inset-0 rounded-full bg-black opacity-40;
}

.badge__emoji {
  mix-blend-mode: luminosity;

  .badge__background--Platinum > &,
  .badge--allOnRed & {
    mix-blend-mode: normal;
  }

  .badge--thousandsEven & {
    transform: scaleX(-1);
  }
}

.badge__text {
  @apply absolute bottom-[2cqmin] min-w-full text-nowrap rounded-md text-center text-xs uppercase;
  @apply bg-[--color-ui-dark] text-[--color-text];
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

.badge__background--Platinum {
  background: linear-gradient(135deg, #ffffff, #d9d9d9);
  border-color: #f0f0f0;
}

.badge__background::after {
  content: '';
  @apply absolute inset-0 rounded-full;
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
