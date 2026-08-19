<script setup lang="ts">
import {ref, watchEffect} from 'vue';
import {getAISummary} from '@/api';
import type {WeekData} from '@/types';

const props = defineProps<{
  weekData: WeekData;
}>();

const summaryText = ref('');
const error = ref(false);
const isGenerating = ref(true);
const turnstileToken = ref('');

watchEffect((onCleanup) => {
  if (!turnstileToken.value) {
    return;
  }

  const controller = new AbortController();
  onCleanup(() => controller.abort());

  isGenerating.value = true;
  error.value = false;
  summaryText.value = '';

  void (async () => {
    try {
      await getAISummary(
        props.weekData,
        turnstileToken.value,
        (text) => {
          summaryText.value = text;
        },
        controller.signal,
      );
    } catch {
      if (!controller.signal.aborted) {
        error.value = true;
      }
    } finally {
      isGenerating.value = false;
    }
  })();
});
</script>
<template>
  <TurnstileWidget
    v-model="turnstileToken"
    action="summarize"
    @error="error = true"
    @unsupported="error = true"
  />
  <p v-if="error">{{ $t('weekSummaryDialog.AISummaryUnavailable') }}</p>
  <SpinnerComponent v-else-if="!turnstileToken" />
  <div v-else class="flex-container flex-col">
    <p>{{ $t('weekSummaryDialog.AIMayContainErrors') }}</p>
    <div class="sr-only" aria-live="polite">
      {{
        $t(
          isGenerating
            ? 'weekSummaryDialog.summaryGenerating'
            : 'weekSummaryDialog.summaryGenerated',
        )
      }}
    </div>
    <div :class="{'ai-content--streaming': isGenerating}" class="ai-content">
      <p
        :aria-busy="isGenerating"
        :aria-description="$t('weekSummaryDialog.AIGeneratedContent')"
        data-test-id="ai-summary"
      >
        {{ summaryText }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.ai-content {
  @apply relative;
  &--streaming::after {
    @apply absolute bottom-0 left-0 right-0 h-12 pointer-events-none;
    content: '';
    background: linear-gradient(
      to bottom,
      transparent,
      color-mix(in srgb, var(--color-bg-alternative) 60%, transparent)
    );
  }
}
</style>
