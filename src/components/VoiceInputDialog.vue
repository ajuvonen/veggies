<script setup lang="ts">
import {onUnmounted, ref, useTemplateRef, watchEffect} from 'vue';
import {useVoiceInput} from '@/hooks/voiceInput';

const open = defineModel<boolean>('open', {required: true});
const veggies = defineModel<string[]>('veggies', {required: true});

const {state, matchedVeggies, start, reset} = useVoiceInput();
const turnstileToken = ref('');
const turnstileWidget = useTemplateRef('turnstileWidget');

const close = () => {
  open.value = false;
};

const confirm = () => {
  veggies.value = [...new Set([...veggies.value, ...matchedVeggies.value])];
  close();
};

watchEffect(() => {
  if (open.value && turnstileToken.value) {
    void start(turnstileToken.value);
  } else if (!open.value) {
    reset();
  }
});

onUnmounted(reset);
</script>
<template>
  <ModalDialog v-model="open" :title="$t('voiceInput.title')">
    <template #content>
      <TurnstileWidget
        ref="turnstileWidget"
        v-model="turnstileToken"
        action="administer-transcribe-token"
      />
      <p>{{ $t('voiceInput.prompt') }}</p>
      <TagsComponent
        v-if="matchedVeggies.size"
        :veggies="matchedVeggies"
        :toggleFn="
          (veggie: string) => {
            matchedVeggies.delete(veggie);
          }
        "
        :ariaLabel="$t('voiceInput.title')"
        ariaTagKey="general.clickToRemove"
        color="selected"
        icon="minus"
      />
      <p class="text-center" aria-live="polite">{{ $t(`voiceInput.${state}`) }}</p>
    </template>
    <template #buttons>
      <ButtonComponent
        v-if="state === 'idle' || state === 'error'"
        :aria-label="$t('voiceInput.listenAgain')"
        color="secondary"
        icon="microphone"
        data-test-id="voice-input-listen-again-button"
        @click="() => turnstileWidget?.reset()"
      />
      <ButtonComponent color="secondary" data-test-id="voice-input-cancel-button" @click="close">
        {{ $t('general.cancel') }}
      </ButtonComponent>
      <ButtonComponent data-test-id="voice-input-confirm-button" @click="confirm">
        {{ $t('general.confirm') }}
      </ButtonComponent>
    </template>
  </ModalDialog>
</template>
