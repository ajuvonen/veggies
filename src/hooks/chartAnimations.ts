import {computed} from 'vue';
import {useAppStateStore} from '@/stores/appStateStore';
import {usePreferredReducedMotion} from '@vueuse/core';

export function useChartAnimations() {
  const preferredMotion = usePreferredReducedMotion();
  const {settings} = useAppStateStore();
  const reduceMotion = computed(() => preferredMotion.value === 'reduce');
  const showChartAnimations = computed({
    get: () => settings.showChartAnimations && !reduceMotion.value,
    set: (value: boolean) => (settings.showChartAnimations = value),
  });

  return {
    reduceMotion,
    showChartAnimations,
  };
}
