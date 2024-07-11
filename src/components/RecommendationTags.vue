<script lang="ts" setup>
import ButtonComponent from '@/components/ButtonComponent.vue';

defineProps<{
  favorites: string[];
}>();

defineEmits(['toggle']);
</script>
<template>
  <div class="recommendations">
    <ButtonComponent
      v-for="veggie in favorites"
      :key="veggie"
      variant="tag"
      @click="$emit('toggle', veggie)"
      >{{ $t(`veggies.${veggie}`) }}</ButtonComponent
    >
  </div>
</template>
<style scoped lang="scss">
.recommendations {
  @apply flex flex-wrap justify-center gap-2;
  @apply max-w-lg;
}
</style>
