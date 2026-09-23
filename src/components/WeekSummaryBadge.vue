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
@reference '@/assets/main.css';
@reference '@/assets/badges.css';

.weekSummaryBadge {
  @apply badge-frame;
}

.weekSummaryBadge__background {
  @apply badge-face text-3xl p-0.5 border-primary;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-active));
}
</style>
