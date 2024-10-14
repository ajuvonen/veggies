<script lang="ts" setup>
import {getRandomEmojis} from '@/utils/helpers';

// const emojis = getRandomEmojis(4);
// Halloween
const emojis = ['🎃', '🎃', '🎃', '🎃'];
</script>
<template>
  <div class="front-page-animation__container" aria-hidden="true">
    <div class="front-page-animation">
      <div v-for="emoji in emojis" :key="emoji" class="front-page-animation__icon-container">
        <span class="front-page-animation__icon">{{ emoji }}</span>
        <span class="front-page-animation__shadow"></span>
      </div>
      <div v-for="emoji in emojis" :key="emoji" class="front-page-animation__icon-container">
        <span class="front-page-animation__icon">{{ emoji }}</span>
        <span class="front-page-animation__shadow"></span>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.front-page-animation__container {
  @apply h-full;
  @apply flex items-center justify-end;
  mask-image: linear-gradient(to right, transparent 5%, black 30%, black 70%, transparent 95%);
}

.front-page-animation {
  @apply flex w-fit;
  animation: marquee 4s linear infinite;
}

.front-page-animation__icon-container {
  @apply relative;
  @apply flex flex-col items-center;
}

@for $i from 1 through 8 {
  .front-page-animation__icon-container:nth-child(#{$i}) span {
    animation-delay: -$i * calc(1s / 4);
  }
}

.front-page-animation__icon {
  @apply text-9xl w-[175px] static z-10;
  @apply flex items-center justify-center;
  animation: bounce 0.5s cubic-bezier(0.5, 0.05, 1, 0.5) infinite alternate;
}

.front-page-animation__shadow {
  @apply absolute h-5 w-28 opacity-0 -bottom-24;
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
    transform: translate3d(0, 0px, 0) scaleX(1) scaleY(1);
  }
  90% {
    transform: translate3d(0, 100px, 0) scaleX(1) scaleY(1);
  }
  100% {
    transform: translate3d(0, 100px, 0) scaleX(1.2) scaleY(0.7);
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
