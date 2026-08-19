<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import type {IconString} from './ui/IconComponent.vue';

const open = defineModel<boolean>({required: true});

const {t, tm} = useI18n();

const steps: {translationKey: string; icon: IconString}[] = [
  {translationKey: 'home.infoSteps.briefly.title', icon: 'humanGreeting'},
  {translationKey: 'home.infoSteps.background.title', icon: 'bookOpen'},
  {translationKey: 'home.infoSteps.features.title', icon: 'starCircle'},
] as const;

const currentStep = ref(0);
const isLastStep = computed(() => currentStep.value === steps.length - 1);
const featuresList = computed(() => tm('home.infoSteps.features.list') as string[]);
const stepAnnouncement = computed(
  () =>
    `${t('home.infoSteps.ariaLabel', [currentStep.value + 1, steps.length, t(steps[currentStep.value].translationKey)])}`,
);

watch(open, (isOpen) => {
  if (isOpen) {
    currentStep.value = 0;
  }
});
</script>
<template>
  <ModalDialog v-model="open" :title="$t(steps[currentStep].translationKey)">
    <template #content>
      <p aria-live="polite" class="sr-only">{{ stepAnnouncement }}</p>
      <div aria-hidden="true" class="flex">
        <div
          v-for="({icon}, index) in steps"
          :key="icon"
          :class="{'opacity-50': index > currentStep}"
          class="home-info-dialog__step"
        >
          <IconComponent :icon="icon" size="2rem" class="fill-[--color-text]" />
        </div>
      </div>
      <p v-if="currentStep === 0">{{ $t('home.infoSteps.briefly.text') }}</p>
      <p v-else-if="currentStep === 1">{{ $t('home.infoSteps.background.text') }}</p>
      <ul v-else class="home-info-dialog__features">
        <li v-for="feature in featuresList" :key="feature">{{ feature }}</li>
      </ul>
    </template>
    <template #buttons>
      <ButtonComponent
        :disabled="currentStep === 0"
        color="secondary"
        data-test-id="home-info-previous-button"
        @click="currentStep = currentStep - 1"
        >{{ $t('general.previous') }}</ButtonComponent
      >
      <ButtonComponent
        :data-test-id="isLastStep ? 'home-info-close-button' : 'home-info-next-button'"
        @click="isLastStep ? (open = false) : (currentStep = currentStep + 1)"
        >{{ isLastStep ? $t('general.close') : $t('general.next') }}</ButtonComponent
      >
    </template>
  </ModalDialog>
</template>
<style scoped>
.home-info-dialog__step {
  @apply w-full py-2;
  @apply bg-[--color-primary-active];
  @apply flex justify-center;
  clip-path: polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%, 15% 50%);
}

.home-info-dialog__features {
  @apply list-disc list-outside pl-5 flex flex-col gap-2;
}
</style>
