<script setup lang="ts">
import {computed, useAttrs} from 'vue';
import {tv} from 'tailwind-variants/lite';

defineOptions({inheritAttrs: false});

const props = withDefaults(
  defineProps<{
    label: string;
    inline?: boolean;
    disabled?: boolean;
  }>(),
  {
    inline: false,
    disabled: false,
  },
);

const model = defineModel<boolean>({required: true});
const guardedModel = computed({
  get: () => model.value,
  set: (value: boolean) => {
    if (!props.disabled) {
      model.value = value;
    }
  },
});
const attrs = useAttrs();
const prefix = computed(() => (attrs.id as string | undefined) ?? crypto.randomUUID());

const toggle = tv({
  slots: {
    root: 'relative inline-flex h-4 w-12 items-center rounded-md outline-offset-4 bg-surface-dark',
    thumb: [
      'inline-flex w-6 h-6 items-center justify-center rounded-md shadow-lg motion-safe:duration-200',
      'bg-surface fill-fg-inverse',
    ],
  },
  variants: {
    disabled: {
      true: {
        root: 'opacity-50 cursor-not-allowed',
      },
      false: {
        thumb: 'hover:bg-primary-hover hover:fill-fg active:bg-primary-active active:fill-fg',
      },
    },
    checked: {
      true: {
        thumb: 'translate-x-6 bg-primary fill-fg',
      },
    },
  },
  defaultVariants: {
    disabled: false,
    checked: false,
  },
});

const {root, thumb} = toggle();
</script>
<template>
  <ContentElement :label :inline :labelAttrs="{for: prefix}" labelTag="label">
    <SwitchRoot
      v-model="guardedModel"
      :id="prefix"
      :aria-disabled="disabled || undefined"
      :class="root({disabled, checked: model})"
      :data-test-id="prefix"
    >
      <SwitchThumb :class="thumb({disabled, checked: model})">
        <IconComponent :icon="model ? 'check' : 'close'" />
      </SwitchThumb>
    </SwitchRoot>
  </ContentElement>
</template>
