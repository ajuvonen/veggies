<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue';
import {omit} from 'remeda';
import {getAISummary} from '@/api';
import type {AIWeekData, WeekData} from '@/types';

const props = defineProps<{
  weekData: WeekData;
}>();

const summaryText = ref('');
const error = ref(false);
const isStreaming = ref(true);
const controller = new AbortController();

onMounted(async () => {
  try {
    const data: AIWeekData = omit(props.weekData, ['promotedAchievement']);
    await getAISummary(data, (text) => {
      summaryText.value = text;
    }, controller.signal);
  } catch {
    error.value = true;
  } finally {
    isStreaming.value = false;
  }
});

onUnmounted(() => controller.abort());
</script>

<template>
  <p v-if="error">{{ $t('weekSummaryDialog.AISummaryUnavailable') }}</p>
  <div v-else class="flex-container flex-col">
    <p>{{ $t('weekSummaryDialog.AIMayContainErrors') }}</p>
    <div :class="{'ai-content--streaming': isStreaming}" class="ai-content">
      <p :aria-description="$t('weekSummaryDialog.AIGeneratedContent')" data-test-id="ai-summary">
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
    background: linear-gradient(to bottom, transparent, color-mix(in srgb, var(--color-bg-alternative) 60%, transparent));
  }
}
</style>
