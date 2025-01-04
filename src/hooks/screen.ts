import {computed, onMounted, onUnmounted, ref, type ComponentPublicInstance, type Ref} from 'vue';
import {useElementBounding} from '@vueuse/core';

export function useScreen(element: Ref<HTMLElement | ComponentPublicInstance | null>) {
  const visualHeight = ref(window.visualViewport?.height ?? window.innerHeight);

  const {top} = useElementBounding(element);

  const maxHeightStyle = computed(
    () => `max-height: calc(${visualHeight.value}px - ${top.value}px - 1rem)`,
  );

  const updateViewportHeight = () => {
    visualHeight.value = window.visualViewport?.height ?? window.innerHeight;
  };

  onMounted(() => {
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewportHeight);
    }
    window.addEventListener('resize', updateViewportHeight);
  });

  onUnmounted(() => {
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', updateViewportHeight);
    }
    window.removeEventListener('resize', updateViewportHeight);
  });

  return {
    visualHeight,
    maxHeightStyle,
  };
}
