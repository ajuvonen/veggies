import type {AIWeekData} from '@/types';
import {AI_SUMMARY_URL} from '@/utils/constants';

export async function getAISummary(weekData: AIWeekData) {
  const res = await fetch(AI_SUMMARY_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(weekData),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    throw new Error(`AI summary request failed: ${res.status}.`);
  }
  const {summary} = (await res.json()) as {summary?: string};
  if (typeof summary !== 'string' || summary.trim() === '') {
    throw new Error('Unexpected response shape.');
  }
  return summary;
}
