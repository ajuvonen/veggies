import {onMounted, type Ref} from 'vue';
import {useElementBounding, useMouse} from '@vueuse/core';

export function useChartContainer(chartContainer: Ref<HTMLDivElement | null>) {
  const {x: mouseX, y: mouseY} = useMouse();
  const {top, bottom} = useElementBounding(chartContainer);

  onMounted(() => {
    if (chartContainer.value) {
      chartContainer.value.scrollLeft = chartContainer.value.scrollWidth;
    }
  });

  return {
    yAlign: () => (mouseY.value < (top.value + bottom.value) / 2 ? 'top' : 'bottom'),
    xAlign: () => {
      let align: 'left' | 'center' | 'right' = 'center';
      if (mouseX.value < window.innerWidth / 2 - 50) {
        align = 'left';
      } else if (mouseX.value > window.innerWidth / 2 + 50) {
        align = 'right';
      }
      return align;
    },
  };
}
