<script lang="ts" setup>
import {usePreferredReducedMotion} from '@vueuse/core';
import {getRandomEmojis} from '@/utils/helpers';

const reducedMotion = usePreferredReducedMotion();

// eslint-disable-next-line prefer-const
let emojis = getRandomEmojis(4);
// Halloween
emojis = ['🎃', '👻', '🧟', '👽'];
// Christmas
// emojis = ['🎅', '☃️', '🤶', '🎄'];
</script>
<template>
  <div class="front-page-animation__container" aria-hidden="true">
    <div
      v-if="reducedMotion !== 'reduce'"
      class="front-page-animation"
      data-test-id="front-page-animation"
    >
      <template v-for="index in 2" :key="index">
        <div v-for="emoji in emojis" :key="emoji" class="front-page-animation__icon-container">
          <span class="front-page-animation__icon">{{ emoji }}</span>
          <span class="front-page-animation__shadow"></span>
        </div>
      </template>
    </div>
  </div>
</template>
<style scoped>
.front-page-animation__container {
  @apply h-1/2;
  @apply flex items-center justify-end;
  mask-image: linear-gradient(to right, transparent 5%, black 30%, black 70%, transparent 95%);
}

.front-page-animation {
  @apply flex w-fit;
  animation: marquee 4s linear infinite;
}

.front-page-animation__icon-container {
  @apply relative select-none -mt-10;
  @apply flex flex-col items-center;
}

.front-page-animation__icon-container {
  &:nth-child(1) {
    --i: 1;
  }

  &:nth-child(2) {
    --i: 2;
  }

  &:nth-child(3) {
    --i: 3;
  }

  &:nth-child(4) {
    --i: 4;
  }

  &:nth-child(5) {
    --i: 5;
  }

  &:nth-child(6) {
    --i: 6;
  }

  &:nth-child(7) {
    --i: 7;
  }

  &:nth-child(8) {
    --i: 8;
  }
}

.front-page-animation__icon-container span {
  animation-delay: calc(var(--i) * calc(-1s / 4));
}

.front-page-animation__icon {
  @apply text-9xl w-[175px] static z-50;
  @apply flex items-center justify-center;
  animation: bounce 0.5s cubic-bezier(0.5, 0.05, 1, 0.5) infinite alternate;
}

.front-page-animation__shadow {
  @apply absolute h-5 w-28 opacity-0 -bottom-16;
  @apply bg-black;
  border-radius: 50%;
  animation: shadow 0.5s cubic-bezier(0.5, 0.05, 1, 0.5) infinite alternate;
}

@keyframes shadow {
  0% {
    opacity: 0;
    transform: scale(0);
    filter: blur(6px);
  }
  90% {
    opacity: 0.2;
    transform: scale(100%);
    filter: blur(2px);
  }
  100% {
    opacity: 0.2;
    transform: scale(110%);
    filter: blur(1px);
  }
}

@keyframes bounce {
  0% {
    transform: translate3d(0, 0, 0) scaleX(1) scaleY(1);
  }
  90% {
    transform: translate3d(0, 75px, 0) scaleX(1) scaleY(1);
  }
  100% {
    transform: translate3d(0, 75px, 0) scaleX(1.2) scaleY(0.7);
  }
}

@keyframes marquee {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(50%, 0, 0);
  }
}
</style>
