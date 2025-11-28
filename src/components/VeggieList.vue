<script lang="ts" setup>
import {useMemoize} from '@vueuse/core';
import {Category, type TranslatedListing} from '@/utils/types';
import {getCategoryForVeggie} from '@/utils/helpers';
import {useAvailableVeggies} from '@/hooks/availableVeggies';
import {useI18nWithCollator} from '@/hooks/i18n';
import VeggieCompletionChart from '@/components/charts/VeggieCompletionChart.vue';

defineProps<{
  uniqueVeggies: string[];
}>();

const {t, collator} = useI18nWithCollator();

const {availableVeggies} = useAvailableVeggies();

const translatedVeggies = useMemoize(() =>
  availableVeggies.value
    .map<TranslatedListing>((veggie) => ({
      veggie,
      category: getCategoryForVeggie(veggie) as Category,
      translation: t(`veggies.${veggie}`),
      synonyms: [],
    }))
    .sort((a, b) => collator.value.compare(a.translation, b.translation)),
);

const specialCases = ['cloudberry', 'raspberry'];
</script>

<template>
  <div class="has-scroll m-0 p-0" data-test-id="veggie-list">
    <VeggieCompletionChart :veggies="uniqueVeggies" />
    <ul v-for="category in Category" :key="category" class="flex gap-4 flex-col">
      <ContentElement :title="$t(`categories.${category}`)">
        <ul class="columns-2 md:columns-3">
          <li
            v-for="{veggie, translation} in translatedVeggies().filter(
              (item) => item.category === category,
            )"
            v-tippy="
              specialCases.includes(veggie)
                ? {
                    content: '❤️',
                    aria: {
                      content: null,
                      expanded: false,
                    },
                    placement: 'top',
                  }
                : undefined
            "
            :key="veggie"
            class="veggie-list__veggie"
          >
            <IconComponent
              :icon="uniqueVeggies.includes(veggie) ? 'checkboxMarked' : 'checkboxBlank'"
            />
            <span class="truncate capitalize" :title="translation">
              {{ translation }}
            </span>
            <span :data-test-id="`veggie-list-status-${veggie}`" class="sr-only">{{
              $t(uniqueVeggies.includes(veggie) ? 'veggieList.complete' : 'veggieList.missing')
            }}</span>
          </li>
        </ul>
      </ContentElement>
    </ul>
  </div>
</template>
<style scoped>
.veggie-list__veggie {
  @apply flex-container items-center;
}
</style>
