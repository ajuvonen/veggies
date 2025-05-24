import {computed, onMounted, type Ref} from 'vue';
import {useMouse} from '@vueuse/core';

export function useChartContainer(chartContainer: Ref<HTMLDivElement | null>) {
  const {x: mouseX, y: mouseY} = useMouse();

  onMounted(() => {
    if (chartContainer.value) {
      chartContainer.value.scrollLeft = chartContainer.value.scrollWidth;
    }
  });

  const chartMidPointY = computed(() => {
    const chartTop = chartContainer.value?.getBoundingClientRect().top ?? 0;
    const chartBottom = chartContainer.value?.getBoundingClientRect().bottom ?? 0;
    return (chartTop + chartBottom) / 2;
  });

  return {
    yAlign: () => (mouseY.value < chartMidPointY.value ? 'top' : 'bottom'),
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
