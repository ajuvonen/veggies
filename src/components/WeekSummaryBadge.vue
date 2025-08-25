<template>
  <div class="flex justify-center items-center">
    <div class="weekSummaryBadge" aria-hidden="true">
      <div class="weekSummaryBadge__background">
        <div class="weekSummaryBadge__emoji">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.weekSummaryBadge {
  @apply relative select-none aspect-square;
  filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.3));
}

.weekSummaryBadge__background {
  @apply relative w-full h-full rounded-full border-4 overflow-hidden text-3xl p-[0.125rem];
  @apply border-[--color-primary];
  @apply flex items-center justify-center;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.3);
  text-shadow: 1px 1px 1px #334155;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-active));
}

.weekSummaryBadge__background::after {
  content: '';
  @apply absolute top-0 left-0 w-full h-full rounded-full;
  background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.5), transparent);
  mask-image: radial-gradient(circle, white 30%, transparent 60%);
  mask-size: 150%;
  mask-position: 30% 30%;
}

.weekSummaryBadge__background::before {
  content: '';
  @apply absolute w-full h-full rounded-full border-2 border-dotted border-inherit;
}
</style>
