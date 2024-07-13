<script lang="ts" setup>
import {ref} from 'vue';
import {useAnimate} from '@vueuse/core';
import IconComponent from '@/components/IconComponent.vue';

const arrow = ref<InstanceType<typeof IconComponent> | null>(null);

useAnimate(
  arrow,
  [
    // Appear with full opacity over 200ms
    {opacity: 0, transform: 'translateY(0px)', offset: 0},
    {opacity: 1, transform: 'translateY(0px)', offset: 0.1333}, // 200ms out of total 1.5s

    // Move down 100px and fade to 80% over next 500ms
    {opacity: 0.8, transform: 'translateY(60px)', offset: 0.4667}, // 700ms out of total 1.5s

    // Stay at 100px and fade out completely over remaining 800ms
    {opacity: 0, transform: 'translateY(60px)', offset: 1},
  ],
  {
    duration: 2000,
    persist: true,
    easing: 'ease-in-out',
    iterations: Infinity,
  },
);
</script>
<template>
  <div class="flex gap-4">
    <IconComponent icon="watermelon" size="5rem" />
    <IconComponent icon="carrot" size="5rem" />
    <IconComponent icon="pear" size="5rem" />
  </div>
  <IconComponent ref="arrow" icon="downArrow" size="10rem" />
</template>
