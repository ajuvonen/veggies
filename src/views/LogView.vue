<script setup lang="ts">
import {provide, readonly, watch} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {difference, first} from 'remeda';
import confetti from 'canvas-confetti';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import {ALL_VEGGIES, KEYS} from '@/utils/constants';
import VeggieSearch from '@/components/VeggieSearch.vue';
import CategoryStatusChart from '@/components/charts/CategoryStatusChart.vue';
import TagsComponent from '@/components/TagsComponent.vue';
import FrontPageAnimation from '@/components/FrontPageAnimation.vue';
import BlueskyLink from '@/components/BlueskyLink.vue';

const {t, tm} = useI18n();

const activityStore = useActivityStore();
const {allVeggies, uniqueVeggies, suggestions, currentVeggies, currentChallenge} =
  storeToRefs(activityStore);
const {toggleVeggie} = activityStore;
const {addToastMessage} = useAppStateStore();

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
      addToastMessage(t('toasts.firstVeggie', [t(`veggies.${currentChallenge.value}`)]));
      showConfetti();
    } else if (newCurrentVeggies.length && !oldCurrentVeggies.length) {
      addToastMessage(t('toasts.newChallenge', [t(`veggies.${currentChallenge.value}`)]));
    } else if (addedVeggie === currentChallenge.value) {
      addToastMessage(t('toasts.challengeCompleted', [cheer]));
      showConfetti();
    } else if (allVeggies.value.length % 100 === 0) {
      addToastMessage(t('toasts.totalVeggies', [allVeggies.value.length, cheer]));
      showConfetti();
    } else if (Math.random() <= 0.4) {
      const facts = [
        ...Object.values<string>(tm(`facts.${addedVeggie}`)),
        t('toasts.uniqueVeggies', [uniqueVeggies.value.length, ALL_VEGGIES.length, cheer]),
        t('toasts.totalVeggies', [allVeggies.value.length, cheer]),
      ];
      addToastMessage(facts[Math.floor(Math.random() * facts.length)]);
    }
  }
});

provide(KEYS.challenge, readonly(currentChallenge));
</script>
<template>
  <h1 class="sr-only">{{ $t('views.log') }}</h1>
  <VeggieSearch v-model="currentVeggies" />
  <CategoryStatusChart v-if="currentVeggies.length" :veggies="currentVeggies" />
  <FrontPageAnimation v-else />
  <TagsComponent
    :veggies="suggestions"
    :variant="['tag', 'primary']"
    ariaKey="general.clickToAdd"
    icon="plus"
    @toggle="(veggie) => toggleVeggie(veggie)"
  />
  <BlueskyLink />
</template>
