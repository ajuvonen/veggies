<script lang="ts" setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import type {ButtonVariant} from '@/components/ButtonComponent.vue';
import type {IconString} from '@/components/IconComponent.vue';

defineEmits<{
  toggle: [veggie: string];
}>();

const props = withDefaults(
  defineProps<{
    veggies: string[];
    icon: IconString;
    variant?: ButtonVariant | ButtonVariant[];
    ariaKey: string;
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
  <TransitionGroup name="tags" tag="ul" class="tags__container">
    <li
      v-for="{veggie, translation} in translatedVeggies"
      :key="veggie"
      :data-test-id="`tag-${veggie}`"
      class="z-10"
    >
      <ButtonComponent
        :aria-label="$t(ariaKey, [translation])"
        :variant="variant"
        @click="$emit('toggle', veggie)"
      >
        <IconComponent :icon="icon" />
        {{ translation }}</ButtonComponent
      >
    </li>
  </TransitionGroup>
</template>
<style scoped>
.tags__container {
  @apply relative has-scroll;
  @apply flex-container flex-wrap justify-center content-start;
}

/* Transition classes */
.tags-enter-active,
.tags-leave-active,
.tags-move {
  transition: all 0.5s ease;
}

.tags-enter-from,
.tags-leave-to {
  opacity: 0;
}

.tags-leave-active {
  @apply z-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
}
</style>
