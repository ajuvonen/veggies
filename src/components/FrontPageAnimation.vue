<script lang="ts" setup>
import {ref} from 'vue';
import {useAnimate} from '@vueuse/core';
import IconComponent from '@/components/IconComponent.vue';

const arrow = ref<InstanceType<typeof IconComponent> | null>(null);

useAnimate(
  arrow,
  [
    // Appear with full opacity
    {opacity: 0, transform: 'translateY(0px)'},
    {opacity: 1, transform: 'translateY(0px)', offset: 0.1333},
    // Move down 100px and fade to 80%
    {opacity: 0.8, transform: 'translateY(85px)', offset: 0.4667},
    // Stay at 100px and fade out completely
    {opacity: 0, transform: 'translateY(85px)'},
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
  <div class="chart-background">
    <div class="front-page-animation__icon-container">
      <IconComponent icon="watermelon" size="5rem" />
      <IconComponent icon="carrot" size="5rem" />
      <IconComponent icon="pear" size="5rem" />
    </div>
    <IconComponent ref="arrow" icon="downArrow" size="10rem" />
  </div>
</template>
<style scoped lang="scss">
.front-page-animation__icon-container {
  @apply flex justify-between;
  @apply w-full max-w-sm;
}
</style>
