<script lang="ts" setup>
import {storeToRefs} from 'pinia';
import {useActivityStore} from '@/stores/activityStore';
import ContentElement from '@/components/ContentElement.vue';

const {categoryFavorites} = storeToRefs(useActivityStore());
</script>
<template>
  <div class="popularity__container">
    <ContentElement
      v-for="[category, favorites] in categoryFavorites"
      :key="category"
      :title="$t(`popularity.${category}`)"
    >
      <ul class="flex-container flex-col align-start">
        <li
          v-for="(emoji, index) in ['🥇', '🥈', '🥉']"
          :key="emoji"
          class="popularity__entry"
          :data-test-id="`popularity-${category}-${index + 1}`"
        >
          <div class="popularity__entry-emoji" aria-hidden="true">{{ emoji }}</div>
          <div v-if="favorites[index]" class="popularity__entry-text">
            {{
              $t('popularity.entry', [$t(`veggies.${favorites[index][0]}`), favorites[index][1]])
            }}
          </div>
          <div v-else class="popularity__entry-text">{{ $t('popularity.noEntry') }}</div>
        </li>
      </ul>
    </ContentElement>
  </div>
</template>
<style lang="scss" scoped>
.popularity__container {
  @apply flex-container flex-col gap-4;
  @apply has-scroll;
}

.popularity__entry {
  @apply flex items-center;
}

.popularity__entry-emoji {
  @apply text-4xl;
  filter: drop-shadow(0 0 2px #fff);
}

.popularity__entry-text {
  @apply capitalize;
}

.popularity__honorable-mentions {
  @apply capitalize list-decimal list-inside;
}
</style>
