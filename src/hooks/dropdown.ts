import {useMemoize} from '@vueuse/core';
import {onBeforeUnmount, ref, watchEffect, type ComponentPublicInstance, type Ref} from 'vue';

export function useDropdown(element: Ref<HTMLElement | ComponentPublicInstance | null>) {
  let targetElement: HTMLElement | null = null;
  const touching = ref(false);

  const toggleTouching = () => (touching.value = true);

  watchEffect(() => {
    // Remove the listener from the previous element if it exists
    targetElement?.removeEventListener('touchstart', toggleTouching);

    // Determine the new target element
    if (element.value) {
      targetElement =
        element.value instanceof HTMLElement ? element.value : (element.value.$el as HTMLElement);

      targetElement?.addEventListener('touchstart', toggleTouching);
    }
  });

  // Cleanup before the component is destroyed
  onBeforeUnmount(() => {
    targetElement?.removeEventListener('touchstart', toggleTouching);
  });

  const getDropdownStyles = useMemoize(
    (active: boolean, selected: boolean) => {
      const textClass =
        active && !touching.value ? 'text-slate-50' : 'text-slate-900 fill-slate-900';
      let bgClass = `bg-slate-50`;
      if (active && !touching.value) {
        bgClass = 'bg-sky-500';
      } else if (selected) {
        bgClass = 'bg-sky-200';
      }

      return `${textClass} ${bgClass}`;
    },
    {
      getKey: (active: boolean, selected: boolean) => `${active}_${selected}_${touching.value}`,
    },
  );

  return {getDropdownStyles};
}
