import {onMounted, onUnmounted, ref} from 'vue';

export function useScreen() {
  const visualHeight = ref(window.visualViewport?.height ?? window.innerHeight);

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
  };
}
