import {ref, watch} from 'vue';
import {usePreferredDark} from '@vueuse/core';

export function useCssColors(variables: string[]) {
  const isDark = usePreferredDark();
  const colors = variables.map(() => ref(''));

  watch(
    isDark,
    () => {
      const styles = getComputedStyle(document.documentElement);
      variables.forEach((name, index) => {
        colors[index].value = styles.getPropertyValue(name).trim();
      });
    },
    {immediate: true},
  );

  return colors;
}
