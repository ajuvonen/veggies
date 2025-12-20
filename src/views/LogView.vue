<script setup lang="ts">
import {defineAsyncComponent, provide, readonly, watch} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {difference} from 'remeda';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import {KEYS} from '@/utils/constants';
import {getRandomItem} from '@/utils/helpers';
import {useAvailableVeggies} from '@/hooks/availableVeggies';
import VeggieSearch from '@/components/VeggieSearch.vue';
import TagsComponent from '@/components/TagsComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import WeekSummaryDialog from '@/components/WeekSummaryDialog.vue';
import AsyncLoader from '@/components/AsyncLoader.vue';

const CategoryStatusChart = defineAsyncComponent(
  () => import('@/components/charts/CategoryStatusChart.vue'),
);

const FrontPageAnimation = defineAsyncComponent(
  () => import('@/components/FrontPageAnimation.vue'),
);

const {t, tm} = useI18n();

const activityStore = useActivityStore();
const {allVeggies, uniqueVeggies, suggestions, currentVeggies, currentChallenge} =
  storeToRefs(activityStore);
const {toggleVeggie} = activityStore;
const {addToastMessage} = useAppStateStore();

const {availableVeggies} = useAvailableVeggies();

const showConfetti = async () => {
  const {default: confetti} = await import('canvas-confetti');
  confetti({
    disableForReducedMotion: true,
    particleCount: 150,
    spread: 70,
    origin: {x: 0.5, y: 0.7},
  });
};

watch(currentVeggies, (newCurrentVeggies, oldCurrentVeggies) => {
  const addedVeggie = difference(newCurrentVeggies, oldCurrentVeggies)[0];
  if (addedVeggie) {
    const cheers: string[] = tm('cheers');
    const cheer = getRandomItem(cheers);
    if (allVeggies.value.length === 1) {
      addToastMessage(t('toasts.firstVeggie', [cheer]));
      showConfetti();
    } else if (currentChallenge.value && newCurrentVeggies.length && !oldCurrentVeggies.length) {
      addToastMessage(t('toasts.newChallenge', [t(`veggies.${currentChallenge.value}`)]));
    } else if (addedVeggie === currentChallenge.value) {
      addToastMessage(t('toasts.challengeCompleted', [cheer]));
      showConfetti();
    } else if (allVeggies.value.length % 100 === 0) {
      addToastMessage(t('toasts.totalVeggies', [allVeggies.value.length, cheer]));
      showConfetti();
    } else if (Math.random() <= 0.5) {
      const facts = [
        ...Object.values<string>(tm(`facts.${addedVeggie}`)),
        t('toasts.uniqueVeggies', [
          uniqueVeggies.value.length,
          availableVeggies.value.length,
          cheer,
        ]),
        t('toasts.totalVeggies', [allVeggies.value.length, cheer]),
      ];

      const occurrences = allVeggies.value.filter((veggie) => veggie === addedVeggie).length;
      if (occurrences > 1) {
        facts.push(t('toasts.occurrences', [occurrences, cheer]));
      }

      addToastMessage(getRandomItem(facts)!);
    }
  }
});

provide(KEYS.challenge, readonly(currentChallenge));
</script>
<template>
  <VeggieSearch v-model="currentVeggies" />
  <AsyncLoader>
    <CategoryStatusChart v-if="currentVeggies.length" :veggies="currentVeggies" />
  </AsyncLoader>
  <AsyncLoader>
    <FrontPageAnimation v-if="!currentVeggies.length" />
  </AsyncLoader>
  <TagsComponent
    :veggies="suggestions"
    :variant="['tag', 'primary']"
    :toggleFn="toggleVeggie"
    :ariaLabel="$t('veggieSearch.suggestions')"
    ariaTagKey="general.clickToAdd"
    icon="plus"
  />
  <FooterComponent />
  <WeekSummaryDialog />
</template>
