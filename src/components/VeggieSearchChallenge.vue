<script setup lang="ts">
import {inject} from 'vue';
import {KEYS} from '@/utils/constants';

const challenge = inject(KEYS.challenge, undefined);
</script>
<template>
  <ComboboxGroup v-if="challenge" data-test-id="veggie-search-challenge">
    <div class="dropdown-list-heading">
      <ComboboxLabel class="flex-container">
        <span aria-hidden="true">🎖️</span>
        <span>{{ $t('veggieSearch.challenge') }}</span>
      </ComboboxLabel>
    </div>
    <VeggieSearchOption :veggie="challenge" />
  </ComboboxGroup>
</template>
