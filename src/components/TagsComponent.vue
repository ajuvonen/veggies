<script lang="ts" setup>
import type {ButtonVariant} from '@/components/ButtonComponent.vue';

withDefaults(
  defineProps<{
    items: string[];
    variant?: ButtonVariant | ButtonVariant[];
  }>(),
  {
    variant: 'primary',
  },
);

defineEmits(['click']);
</script>
<template>
  <TransitionGroup name="list" tag="ul" class="tags__container flex-container">
    <li v-for="item in items" :key="item" class="tags__tag">
      <ButtonComponent :variant="variant" @click="$emit('click', item)"
        ><slot name="item" :item="item">{{ item }}</slot></ButtonComponent
      >
    </li>
  </TransitionGroup>
</template>
<style lang="scss" scoped>
.tags__container {
  @apply max-w-lg relative;
  @apply flex-wrap justify-center;
}

.tags__tag {
  z-index: 1;
  transform-origin: center;
}

/* Transition classes */
.list-enter-active,
.list-leave-active,
.list-move {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}

.list-leave-active {
  @apply z-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
}
</style>
