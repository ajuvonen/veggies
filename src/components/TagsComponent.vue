<script lang="ts" setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import type {ButtonVariant} from '@/components/ButtonComponent.vue';
import type {IconString} from '@/components/IconComponent.vue';

defineEmits(['click']);
const props = withDefaults(
  defineProps<{
    veggies: string[];
    icon: IconString;
    variant?: ButtonVariant | ButtonVariant[];
  }>(),
  {
    variant: () => ['primary'],
  },
);

const {t, locale} = useI18n();

const translatedVeggies = computed(() => {
  const collator = new Intl.Collator(locale.value);
  return props.veggies
    .map((veggie) => ({
      veggie,
      translation: t(`veggies.${veggie}`),
    }))
    .sort((a, b) => collator.compare(a.translation, b.translation));
});
</script>
<template>
  <TransitionGroup name="list" tag="ul" class="tags__container">
    <li v-for="{veggie, translation} in translatedVeggies" :key="veggie" class="tags__tag">
      <ButtonComponent :variant="variant" @click="$emit('click', veggie)">
        <IconComponent :icon="icon" />
        {{ translation }}</ButtonComponent
      >
    </li>
  </TransitionGroup>
</template>
<style lang="scss" scoped>
.tags__container {
  @apply relative;
  @apply flex-container flex-wrap justify-center;
}

.tags__tag {
  z-index: 1;
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
