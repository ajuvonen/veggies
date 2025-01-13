import {computed} from 'vue';
import {useMemoize, usePointer} from '@vueuse/core';

export function useDropdown() {
  const {pointerType} = usePointer();
  const hasMouse = computed(() => pointerType.value === 'mouse');

  const getDropdownStyles = useMemoize(
    (active: boolean, selected: boolean) => {
      const textClass =
        active && hasMouse.value ? 'text-slate-50' : 'text-slate-900 fill-slate-900';
      let bgClass = `bg-slate-50`;
      if (active && hasMouse.value) {
        bgClass = 'bg-sky-500';
      } else if (selected) {
        bgClass = 'bg-sky-200';
      }

      return `${textClass} ${bgClass}`;
    },
    {
      getKey: (active: boolean, selected: boolean) => `${active}_${selected}_${hasMouse.value}`,
    },
  );

  return {getDropdownStyles};
}
