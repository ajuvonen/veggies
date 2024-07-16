<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useActivityStore} from '@/stores/activityStore';
import VeggieSearch from '@/components/VeggieSearch.vue';
import WeekStatus from '@/components/WeekStatus.vue';
import TagsComponent from '@/components/TagsComponent.vue';
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';

const {t, locale} = useI18n();

const activityStore = useActivityStore();
const {favorites} = storeToRefs(activityStore);
const {toggleVeggie} = activityStore;

const translatedVeggies = computed(() => {
  const collator = new Intl.Collator(locale.value);
  return favorites.value
    .map((veggie) => ({
      veggie,
      translation: t(`veggies.${veggie}`),
    }))
    .sort((a, b) => collator.compare(a.translation, b.translation));
});
</script>
<template>
  <WeekStatus />
  <VeggieSearch @toggle="toggleVeggie" />
  <TagsComponent
    :items="translatedVeggies"
    :variant="['tag', 'primary']"
    icon="plus"
    @click="(veggie) => toggleVeggie(veggie)"
  />
</template>
