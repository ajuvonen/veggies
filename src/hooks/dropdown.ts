import {computed} from 'vue';
import {useMemoize, usePointer} from '@vueuse/core';

export function useDropdown() {
  const {pointerType} = usePointer();
  const hasMouse = computed(() => pointerType.value === 'mouse');

  const getDropdownStyles = useMemoize(
    (active: boolean, selected: boolean) => {
      const textClass =
        active && hasMouse.value
          ? 'text-[--color-text] fill-[--color-text]'
          : 'text-[--color-text-alternative] fill-[--color-text-alternative]';
      let bgClass = `bg-[--color-bg-alternative]`;
      if (active && hasMouse.value) {
        bgClass = 'bg-[--color-highlight]';
      } else if (selected) {
        bgClass = 'bg-sky-200 dark:bg-sky-300';
      }

      return `${textClass} ${bgClass}`;
    },
    {
      getKey: (active: boolean, selected: boolean) => `${active}_${selected}_${hasMouse.value}`,
    },
  );

  return {getDropdownStyles};
}
