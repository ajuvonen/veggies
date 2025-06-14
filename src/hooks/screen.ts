import {computed, type ComponentPublicInstance, type Ref} from 'vue';
import {useElementBounding, useWindowSize} from '@vueuse/core';

export function useScreen(element: Ref<HTMLElement | ComponentPublicInstance | null>) {
  const {height: visualHeight} = useWindowSize({type: 'visual'});

  const {top} = useElementBounding(element);

  const maxHeight = computed(() => visualHeight.value - top.value);

  return {
    visualHeight,
    maxHeight,
  };
}
