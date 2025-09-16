<script lang="ts" setup>
import {computed, nextTick, useTemplateRef} from 'vue';
import {useI18nWithCollator} from '@/hooks/i18n';
import type {IconString} from '@/components/IconComponent.vue';
import ButtonComponent, {type ButtonVariant} from '@/components/ButtonComponent.vue';

const props = withDefaults(
  defineProps<{
    veggies: string[];
    icon: IconString;
    variant?: ButtonVariant | ButtonVariant[];
    ariaLabel: string;
    ariaTagKey: string;
    toggleFn: (veggie: string) => void;
  }>(),
  {
    variant: () => ['primary'],
  },
);

const {t, collator} = useI18nWithCollator();

const listElement = useTemplateRef('listElement');

const translatedVeggies = computed(() =>
  props.veggies
    .map((veggie) => ({
      veggie,
      translation: t(`veggies.${veggie}`),
    }))
    .sort((a, b) => collator.value.compare(a.translation, b.translation)),
);

const toggle = async (veggie: string, index: number) => {
  props.toggleFn(veggie);
  await nextTick();
  const focusTarget = translatedVeggies.value[index] || translatedVeggies.value[index - 1];
  const focusElement =
    document.getElementById(`tag-button-${focusTarget?.veggie}`) || listElement.value;
  focusElement?.focus();
};
</script>
<template>
  <ul ref="listElement" :aria-label="ariaLabel" tabindex="-1" tag="ul" class="tags__container">
    <TransitionGroup name="tags">
      <li
        v-for="({veggie, translation}, index) in translatedVeggies"
        :key="veggie"
        :data-test-id="`tag-${veggie}`"
        class="z-10"
      >
        <ButtonComponent
          :id="`tag-button-${veggie}`"
          :variant="variant"
          :aria-label="$t(ariaTagKey, [translation])"
          @click="toggle(veggie, index)"
        >
          <IconComponent :icon="icon" />
          {{ translation }}</ButtonComponent
        >
      </li>
    </TransitionGroup>
  </ul>
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
