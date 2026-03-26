<script setup lang="ts">
defineProps<{
  veggie: string;
  translation?: string;
}>();
</script>
<template>
  <ComboboxItem
    :value="veggie"
    :textValue="translation || $t(`veggies.${veggie}`)"
    :data-test-id="`veggie-search-option-${veggie}`"
    class="dropdown-list-option"
  >
    <span>
      {{ translation || $t(`veggies.${veggie}`) }}
    </span>
    <ComboboxItemIndicator asChild>
      <IconComponent icon="check" />
    </ComboboxItemIndicator>
  </ComboboxItem>
</template>
