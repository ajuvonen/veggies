import {ref, watch} from 'vue';
import {usePreferredDark} from '@vueuse/core';

export function useCssColors(variables: string[]) {
  const isDark = usePreferredDark();
  const colors = variables.map(() => ref(''));

  watch(
    isDark,
    () => {
      variables.forEach((name, index) => {
        colors[index].value = getComputedStyle(document.documentElement).getPropertyValue(name);
      });
    },
    {immediate: true},
  );

  return colors;
}
