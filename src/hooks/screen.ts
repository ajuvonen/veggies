import {computed, type ComponentPublicInstance, type Ref} from 'vue';
import {useElementBounding, useWindowSize} from '@vueuse/core';

export function useScreen(
  element: Ref<HTMLElement | ComponentPublicInstance | null>,
  bottomPadding: number = 1,
) {
  const {height} = useWindowSize({type: 'visual'});

  const {top} = useElementBounding(element);

  const maxHeightStyle = computed(
    () => `max-height: calc(${height.value}px - ${top.value}px - ${bottomPadding}rem)`,
  );

  return {
    visualHeight: height,
    maxHeightStyle,
  };
}
