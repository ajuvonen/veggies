<script lang="ts" setup>
import IconComponent from '@/components/IconComponent.vue';
</script>
<template>
  <div class="chart-background justify-center">
    <div class="front-page-animation">
      <div class="front-page-animation__content">
        <div class="flex">
          <IconComponent icon="watermelon" size="9rem" />
          <IconComponent icon="carrot" size="9rem" />
          <IconComponent icon="pear" size="9rem" />
          <IconComponent icon="apple" size="9rem" />
        </div>
        <div class="flex">
          <IconComponent icon="watermelon" size="9rem" />
          <IconComponent icon="carrot" size="9rem" />
          <IconComponent icon="pear" size="9rem" />
          <IconComponent icon="apple" size="9rem" />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.front-page-animation {
  @apply w-full overflow-hidden;
  mask-image: linear-gradient(to right, transparent 5%, black 30%, black 70%, transparent 95%);
}

.front-page-animation__content {
  @apply flex;
  width: calc(8 * 9rem);
  animation: marquee 10s linear infinite;
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
