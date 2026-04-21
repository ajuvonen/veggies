import {EventSourceParserStream} from 'eventsource-parser/stream';
import type {AIWeekData} from '@/types';
import {AI_SUMMARY_URL} from '@/utils/constants';

export async function getAISummary(
  weekData: AIWeekData,
  onChunk: (text: string) => void,
): Promise<string> {
  const res = await fetch(AI_SUMMARY_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(weekData),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    throw new Error(`AI summary request failed: ${res.status}.`);
  } else if (!res.body) {
    throw new Error('AI summary response has no body.');
  }

  const reader = res.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream())
    .getReader();

  let fullText = '';

  try {
    while (true) {
      const {done, value: event} = await reader.read();
      if (done) break;
      if (event.data === '[DONE]') return fullText;
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
          fullText += parsed.delta.text;
          onChunk(fullText);
        }
      } catch {
        // skip non-JSON events
      }
    }
  } finally {
    reader.releaseLock();
  }

  if (fullText.trim() === '') {
    throw new Error('Unexpected response shape.');
  }

  return fullText;
}
