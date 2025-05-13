<script setup lang="ts">
import {inject} from 'vue';
import {ComboboxOption} from '@headlessui/vue';
import {KEYS} from '@/utils/constants';
defineProps<{
  veggie: string;
  translation?: string;
}>();

const getDropdownStyles = inject(KEYS.dropdownStyles);
</script>
<template>
  <ComboboxOption v-slot="{active, selected}" as="template" :key="veggie" :value="veggie">
    <div
      :class="[getDropdownStyles!(active, selected), 'dropdown-list-option']"
      :data-test-id="`veggie-search-option-${veggie}`"
    >
      <span>
        {{ translation || $t(`veggies.${veggie}`) }}
      </span>
      <IconComponent v-if="selected" icon="check" />
    </div>
  </ComboboxOption>
</template>
