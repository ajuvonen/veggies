<script setup lang="ts">
import {provide, readonly, watch} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {difference, first} from 'remeda';
import confetti from 'canvas-confetti';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import {KEYS} from '@/utils/constants';
import {useAvailableVeggies} from '@/hooks/availableVeggies';
import VeggieSearch from '@/components/VeggieSearch.vue';
import CategoryStatusChart from '@/components/charts/CategoryStatusChart.vue';
import TagsComponent from '@/components/TagsComponent.vue';
import FrontPageAnimation from '@/components/FrontPageAnimation.vue';
import FooterComponent from '@/components/FooterComponent.vue';

const {t, tm} = useI18n();

const activityStore = useActivityStore();
const {allVeggies, uniqueVeggies, suggestions, currentVeggies, currentChallenge} =
  storeToRefs(activityStore);
const {toggleVeggie} = activityStore;
const {addToastMessage} = useAppStateStore();

const {availableVeggies} = useAvailableVeggies();

const showConfetti = () =>
  confetti({
    disableForReducedMotion: true,
    particleCount: 150,
    spread: 70,
    origin: {x: 0.5, y: 0.7},
  });

watch(currentVeggies, (newCurrentVeggies, oldCurrentVeggies) => {
  const addedVeggie = first(difference(newCurrentVeggies, oldCurrentVeggies));
  if (addedVeggie) {
    const cheers: string[] = tm('cheers');
    const cheer = cheers[Math.floor(Math.random() * cheers.length)];
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

      addToastMessage(facts[Math.floor(Math.random() * facts.length)]);
    }
  }
});

provide(KEYS.challenge, readonly(currentChallenge));
</script>
<template>
  <VeggieSearch v-model="currentVeggies" />
  <CategoryStatusChart v-if="currentVeggies.length" :veggies="currentVeggies" />
  <FrontPageAnimation v-else />
  <TagsComponent
    :veggies="suggestions"
    :variant="['tag', 'primary']"
    :toggleFn="toggleVeggie"
    :ariaLabel="$t('veggieSearch.suggestions')"
    ariaTagKey="general.clickToAdd"
    icon="plus"
  />
  <FooterComponent />
</template>
