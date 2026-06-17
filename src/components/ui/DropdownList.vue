<script setup lang="ts" generic="T extends string | number | object | null">
import {computed, useAttrs} from 'vue';

defineOptions({inheritAttrs: false});

withDefaults(
  defineProps<{
    options: T[];
    label: string;
    keyFn?: (item: T) => string | number;
    by?: ((a: T, b: T) => boolean) | string;
  }>(),
  {
    keyFn: (item: T) => JSON.stringify(item),
  },
);

const model = defineModel<T>({required: true});
const attrs = useAttrs();
const prefix = computed(() => (attrs.id as string | undefined) ?? crypto.randomUUID());
</script>
<template>
  <ContentElement :label :labelAttrs="{for: `${prefix}-button`}" labelTag="label">
    <SelectRoot v-model="model" v-slot="{open}" :by="by">
      <SelectTrigger asChild>
        <ButtonComponent
          :id="`${prefix}-button`"
          :data-test-id="`${prefix}-button`"
          class="justify-between"
        >
          <SelectValue />
          <SelectIcon asChild>
            <IconComponent
              :class="{'rotate-180': open}"
              class="transition duration-200"
              icon="chevronDown"
            />
          </SelectIcon>
        </ButtonComponent>
      </SelectTrigger>
      <SelectPortal>
        <SelectContent
          class="z-20"
          position="popper"
          :bodyLock="false"
          :disableOutsidePointerEvents="false"
        >
          <SelectViewport
            :data-test-id="`${prefix}-options`"
            class="dropdown-list-container"
            style="max-height: calc(var(--reka-select-content-available-height) - 1rem)"
          >
            <SelectItem
              v-for="(option, index) in options"
              :key="keyFn(option)"
              :value="option"
              :data-test-id="`${prefix}-option-${index}`"
              class="dropdown-list-option"
            >
              <SelectItemText>
                <slot name="option" :item="option">
                  {{ option }}
                </slot>
              </SelectItemText>
              <SelectItemIndicator asChild>
                <IconComponent icon="check" />
              </SelectItemIndicator>
            </SelectItem>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </ContentElement>
</template>
