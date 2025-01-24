<script lang="ts" setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {ALL_VEGGIES} from '@/utils/constants';
import {Category, type TranslatedListing} from '@/utils/types';
import {getCategoryForVeggie} from '@/utils/helpers';
import VeggieCompletionChart from '@/components/charts/VeggieCompletionChart.vue';

defineProps<{
  uniqueVeggies: string[];
}>();

const {t, locale} = useI18n();

const allVeggies = computed(() => {
  const collator = new Intl.Collator(locale.value);
  return ALL_VEGGIES.map<TranslatedListing>((veggie) => ({
    veggie,
    category: getCategoryForVeggie(veggie) as Category,
    translation: t(`veggies.${veggie}`),
  })).sort((a, b) => collator.compare(a.translation, b.translation));
});
</script>

<template>
  <div class="veggie-list" data-test-id="veggie-list">
    <VeggieCompletionChart :veggies="uniqueVeggies" />
    <ul v-for="category in Category" :key="category" class="veggie-list__category">
      <ContentElement :title="$t(`categories.${category}`)">
        <ul class="veggie-list__veggies">
          <li
            v-for="{veggie, translation} in allVeggies.filter((item) => item.category === category)"
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
.veggie-list {
  @apply has-scroll m-0 p-0;
  @apply flex-container flex-col gap-4;
}

.veggie-list__category {
  @apply flex-container gap-4 flex-col;
}

.veggie-list__veggies {
  @apply columns-2 md:columns-3;
}

.veggie-list__veggie {
  @apply flex-container items-center;
}
</style>
