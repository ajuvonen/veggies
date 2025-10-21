<script setup lang="ts" generic="T extends string | number | object | null">
import {inject, useTemplateRef} from 'vue';
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
  TransitionRoot,
} from '@headlessui/vue';
import {useScreen} from '@/hooks/screen';
import {KEYS} from '@/utils/constants';
import ButtonComponent from '@/components/ButtonComponent.vue';
import IconComponent from '@/components/IconComponent.vue';
import ContentElement from '@/components/ContentElement.vue';

withDefaults(
  defineProps<{
    options: T[];
    label: string;
    keyFn?: (item: T) => string | number;
    prefix?: string;
  }>(),
  {
    keyFn: (item: T) => String(item),
    prefix: 'dropdown',
  },
);

const selected = defineModel<T>({required: true});

const optionsElement = useTemplateRef('optionsElement');
const {maxHeight} = useScreen(optionsElement);
const getDropdownStyles = inject(KEYS.dropdownStyles);
</script>

<template>
  <Listbox v-model="selected" class="relative z-30" as="div" v-slot="{open}">
    <ContentElement :title="label" :labelTag="ListboxLabel">
      <ListboxButton
        :as="ButtonComponent"
        class="justify-between"
        :data-test-id="`${prefix}-button`"
      >
        <slot name="selected" :item="selected" :open="open">
          {{ selected }}
        </slot>
        <IconComponent :class="open ? 'rotate-180 transform' : ''" icon="chevronDown" />
      </ListboxButton>
    </ContentElement>
    <TransitionRoot
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <ListboxOptions
        ref="optionsElement"
        :style="`max-height: calc(${maxHeight}px - 1rem)`"
        class="dropdown-list-container"
      >
        <ListboxOption
          v-for="(option, index) in options"
          v-slot="{active, selected: isSelected}"
          :key="keyFn(option)"
          :value="option"
          :data-test-id="`${prefix}-option-${index}`"
          as="template"
        >
          <li
            :class="[getDropdownStyles?.(active, isSelected), 'dropdown-list-option']"
            role="menuitem"
          >
            <slot name="option" :item="option" :index="index">
              {{ option }}
            </slot>
            <IconComponent v-if="isSelected" icon="check" />
          </li>
        </ListboxOption>
      </ListboxOptions>
    </TransitionRoot>
  </Listbox>
</template>
