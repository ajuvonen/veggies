import {storeToRefs} from 'pinia';
import {computed} from 'vue';
import {useAppStateStore} from '@/stores/appStateStore';
import {usePreferredReducedMotion} from '@vueuse/core';

export function useChartAnimations() {
  const preferredMotion = usePreferredReducedMotion();
  const {settings} = storeToRefs(useAppStateStore());
  const reduceMotion = computed(() => preferredMotion.value === 'reduce');
  const showChartAnimations = computed({
    get: () => settings.value.showChartAnimations && !reduceMotion.value,
    set: (value: boolean) => (settings.value.showChartAnimations = value),
  });

  return {
    reduceMotion,
    showChartAnimations,
  };
}
