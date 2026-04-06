<script setup lang="ts" generic="T extends string | number | object | null">
withDefaults(
  defineProps<{
    options: T[];
    label: string;
    keyFn?: (item: T) => string | number;
    prefix?: string;
    by?: ((a: T, b: T) => boolean) | string;
  }>(),
  {
    keyFn: (item: T) => JSON.stringify(item),
    prefix: 'dropdown',
  },
);

const model = defineModel<T>({required: true});
</script>

<template>
  <ContentElement :title="label" :labelAttrs="{for: `${prefix}-button`}" labelTag="label">
    <SelectRoot v-model="model" v-slot="{open}" :by="by" :data-test-id="prefix">
      <SelectTrigger :id="`${prefix}-button`" asChild>
        <ButtonComponent :data-test-id="`${prefix}-button`" class="justify-between">
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
