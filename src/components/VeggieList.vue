<script lang="ts" setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {ALL_VEGGIES} from '@/utils/constants';
import {Category, type TranslatedListing} from '@/utils/types';
import {getCategoryForVeggie} from '@/utils/helpers';

defineProps<{
  uniqueVeggies: string[];
}>();

const {t, locale} = useI18n();

const allVeggies = computed(() => {
  const collator = new Intl.Collator(locale.value);
  return ALL_VEGGIES.map<TranslatedListing>((veggie) => ({
    veggie,
    category: getCategoryForVeggie(veggie),
    translation: t(`veggies.${veggie}`),
  })).sort((a, b) => collator.compare(a.translation, b.translation));
});
</script>

<template>
  <div class="veggie-list" data-test-id="veggie-list">
    <ul v-for="category in Category" :key="category" class="veggie-list__category">
      <h2 class="label-like">{{ $t(`categories.${category}`) }}</h2>
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
    </ul>
  </div>
</template>
<style lang="scss" scoped>
.veggie-list {
  @apply has-scroll;
  @apply flex-container flex-col gap-4;
}

.veggie-list__category {
  @apply flex-container flex-col;
}

.veggie-list__veggies {
  @apply columns-2 md:columns-3;
}

.veggie-list__veggie {
  @apply flex-container items-center;
}
</style>
