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
  @apply relative select-none;
  @apply flex items-center justify-center;

  &[aria-disabled='true'] {
    opacity: 0.5;
  }
}

.badge__background {
  @apply h-24 w-24 sm:h-40 sm:w-40 relative rounded-full border-4;
  box-shadow:
    inset 0 0 15px rgba(0, 0, 0, 0.3),
    0 5px 15px rgba(0, 0, 0, 0.3);
}

.badge__emoji {
  @apply absolute text-[3.5rem] sm:text-[6.5rem];
}

.badge__text {
  @apply absolute bottom-2 sm:bottom-4 w-[6.20rem] sm:w-40 rounded-md text-center text-xs uppercase left-1/2 -translate-x-1/2 shadow-md;
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
  @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dotted border-inherit;
  @apply w-[88px] h-[88px] sm:w-[152px] sm:h-[152px];
}
</style>
