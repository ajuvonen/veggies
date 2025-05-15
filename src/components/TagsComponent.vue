<script lang="ts" setup>
import {computed, ref, nextTick} from 'vue';
import {useI18n} from 'vue-i18n';
import type {ButtonVariant} from '@/components/ButtonComponent.vue';
import type {IconString} from '@/components/IconComponent.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';

const props = withDefaults(
  defineProps<{
    veggies: string[];
    icon: IconString;
    variant?: ButtonVariant | ButtonVariant[];
    ariaKey: string;
    toggleFn: (veggie: string) => void;
  }>(),
  {
    variant: () => ['primary'],
  },
);

const {t, locale} = useI18n();

const tags = ref<typeof ButtonComponent | null>(null);
const listElement = ref<HTMLUListElement | null>(null);

const translatedVeggies = computed(() => {
  const collator = new Intl.Collator(locale.value);
  return props.veggies
    .map((veggie) => ({
      veggie,
      translation: t(`veggies.${veggie}`),
    }))
    .sort((a, b) => collator.compare(a.translation, b.translation));
});

const toggle = async (veggie: string, index: number) => {
  props.toggleFn(veggie);
  await nextTick();
  const focusElement =
    tags.value?.[index] || tags.value?.[tags.value.length - 1] || listElement.value;
  focusElement.$el.focus();
};
</script>
<template>
  <TransitionGroup
    v-if="veggies.length"
    ref="listElement"
    tabindex="-1"
    name="tags"
    tag="ul"
    class="tags__container"
  >
    <li
      v-for="({veggie, translation}, index) in translatedVeggies"
      :key="veggie"
      :data-test-id="`tag-${veggie}`"
      class="z-10"
    >
      <ButtonComponent
        ref="tags"
        :aria-label="$t(ariaKey, [translation])"
        :variant="variant"
        @click="toggle(veggie, index)"
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
