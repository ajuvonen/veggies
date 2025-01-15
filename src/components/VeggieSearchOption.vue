<script setup lang="ts">
import {ComboboxOption} from '@headlessui/vue';
import {useDropdown} from '@/hooks/dropdown';
defineProps<{
  veggie: string;
  translation?: string;
}>();

const {getDropdownStyles} = useDropdown();
</script>
<template>
  <ComboboxOption v-slot="{active, selected}" as="template" :key="veggie" :value="veggie">
    <li
      :class="[getDropdownStyles(active, selected), 'veggie-search__option']"
      :data-test-id="`veggie-search-option-${veggie}`"
      role="menuitem"
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
