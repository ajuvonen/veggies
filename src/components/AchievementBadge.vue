<script setup lang="ts">
defineProps<{
  text: string;
  color: 'bronze' | 'silver' | 'gold';
  emoji: string;
  active: boolean;
}>();
</script>
<template>
  <div class="badge" :aria-disabled="!active">
    <div class="badge__background" :class="[`badge__background--${color}`]"></div>
    <div aria-hidden="true" class="badge__emoji">
      {{ emoji }}
    </div>
    <div aria-hidden="true" class="badge__text">{{ text }}</div>
  </div>
</template>
<style lang="scss" scoped>
.badge {
  @apply relative select-none aspect-square;
  @apply flex items-center justify-center;
  flex: 0 0 calc(33% - 5px);

  &[aria-disabled='true'] {
    opacity: 0.5;
  }
}

.badge__background {
  @apply relative w-full h-full rounded-full border-4;
  box-shadow:
    inset 0 0 15px rgba(0, 0, 0, 0.3),
    0 5px 15px rgba(0, 0, 0, 0.3);
}

.badge__emoji {
  @apply absolute text-[17cqmin] sm:text-[15cqmin] leading-[1.3];
  text-shadow: 1px 1px 1px #334155;
  mix-blend-mode: luminosity;
}

.badge__text {
  @apply absolute bottom-[3cqmin] min-w-full text-nowrap rounded-md text-center text-xs uppercase shadow-md;
  @apply bg-slate-700;
}

.badge__background--bronze {
  background: linear-gradient(135deg, #cd7f32, #b87333);
  border-color: #d48b47;
}

.badge__background--silver {
  background: linear-gradient(135deg, #c0c0c0, #a9a9a9);
  border-color: #c9c9c9;
}

.badge__background--gold {
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
