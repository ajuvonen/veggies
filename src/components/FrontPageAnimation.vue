<script lang="ts" setup></script>
<template>
  <div class="chart-background justify-center">
    <div class="front-page-animation">
      <div class="front-page-animation__content">
        <div class="flex">
          <IconComponent class="front-page-animation__icon" icon="watermelon" size="9rem" />
          <IconComponent
            class="front-page-animation__icon"
            style="animation-delay: -750ms"
            icon="carrot"
            size="9rem"
          />
          <IconComponent
            class="front-page-animation__icon"
            style="animation-delay: -500ms"
            icon="pear"
            size="9rem"
          />
          <IconComponent
            class="front-page-animation__icon"
            style="animation-delay: -250ms"
            icon="apple"
            size="9rem"
          />
        </div>
        <div class="flex">
          <IconComponent class="front-page-animation__icon" icon="watermelon" size="9rem" />
          <IconComponent
            class="front-page-animation__icon"
            style="animation-delay: -750ms"
            icon="carrot"
            size="9rem"
          />
          <IconComponent
            class="front-page-animation__icon"
            style="animation-delay: -500ms"
            icon="pear"
            size="9rem"
          />
          <IconComponent
            class="front-page-animation__icon"
            style="animation-delay: -250ms"
            icon="apple"
            size="9rem"
          />
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

.front-page-animation__icon {
  animation: jitter 1000ms ease-out infinite;
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@keyframes jitter {
  0% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(0.75rem);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
