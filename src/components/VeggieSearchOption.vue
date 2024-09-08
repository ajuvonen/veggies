<script setup lang="ts">
import {useMemoize} from '@vueuse/core';
import {ComboboxOption} from '@headlessui/vue';
defineProps<{
  veggie: string;
  translation?: string;
}>();

const getOptionClasses = useMemoize((active: boolean, selected: boolean) => {
  const textClass = active ? 'text-slate-50' : 'text-slate-900 fill-slate-900';
  let bgClass = `bg-slate-50`;
  if (active) {
    bgClass = 'bg-sky-500';
  } else if (selected) {
    bgClass = 'bg-sky-200';
  }

  return `${textClass} ${bgClass}`;
});
</script>
<template>
  <ComboboxOption v-slot="{active, selected}" as="template" :key="veggie" :value="veggie">
    <li :class="[getOptionClasses(active, selected), 'veggie-search__option']" role="menuitem">
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
