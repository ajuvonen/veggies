<script setup lang="ts">
import {ref} from 'vue';
import {getAiSummary} from '@/api';
import type {AIWeekData} from '@/types';

const props = defineProps<{
  weekData: AIWeekData;
}>();

const summaryText = ref<string | null>(null);
const error = ref(false);
try {
  summaryText.value = await getAiSummary(props.weekData);
} catch {
  error.value = true;
}
</script>

<template>
  <p v-if="error">{{ $t('weekSummaryDialog.AISummaryUnavailable') }}</p>
  <div v-else class="flex-container flex-col">
    <p>{{ $t('weekSummaryDialog.AIMayContainErrors') }}</p>
    <div class="fade-wrap relative">
      <p :aria-description="$t('weekSummaryDialog.AIGeneratedContent')" data-test-id="ai-summary">
        {{ summaryText }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.fade-wrap::after {
  @apply bottom-0 left-0 right-0 h-full absolute;
  content: '';
  background: linear-gradient(to bottom, transparent 0%, var(--color-bg-alternative) 30%);
  animation: reveal 2s ease forwards;
}

@keyframes reveal {
  from {
    height: 100%;
  }
  to {
    height: 0%;
  }
}
</style>
