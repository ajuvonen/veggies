<script setup lang="ts">
import {inject} from 'vue';
import {ComboboxOption} from '@headlessui/vue';
import {KEYS} from '@/utils/constants';
defineProps<{
  veggie: string;
  translation?: string;
}>();

const dropdownOptions = inject(KEYS.dropdownOptions)!;
</script>
<template>
  <ComboboxOption v-slot="{active, selected}" as="template" :key="veggie" :value="veggie">
    <li
      :class="[dropdownOptions(active, selected), 'veggie-search__option']"
      role="menuitem"
      :data-test-id="`veggie-search-option-${veggie}`"
    >
      <span>
        {{ translation || $t(`veggies.${veggie}`) }}
      </span>
      <IconComponent v-if="selected" icon="check" />
    </li>
  </ComboboxOption>
</template>
<style lang="scss" scoped>
.veggie-search__option {
  @apply dropdown-list-option;
}
</style>
