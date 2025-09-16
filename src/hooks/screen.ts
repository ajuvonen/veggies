import {computed, type ComponentPublicInstance, type TemplateRef} from 'vue';
import {useElementBounding, useWindowSize} from '@vueuse/core';

export function useScreen(element: TemplateRef<HTMLElement | ComponentPublicInstance>) {
  const {height: visualHeight} = useWindowSize({type: 'visual'});

  const {top} = useElementBounding(element);

  const maxHeight = computed(() => visualHeight.value - top.value);

  return {
    visualHeight,
    maxHeight,
  };
}
