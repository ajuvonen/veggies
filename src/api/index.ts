import type {AIWeekData} from '@/types';
import {AI_SUMMARY_URL} from '@/utils/constants';

function processLine(line: string): string | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  const jsonStr = trimmed.startsWith('data: ') ? trimmed.slice(6) : trimmed;
  if (jsonStr === '[DONE]') return null;
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
      return parsed.delta.text;
    }
  } catch {
    // skip non-JSON lines
  }
  return null;
}

export async function getAISummary(
  weekData: AIWeekData,
  onChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch(AI_SUMMARY_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(weekData),
    signal: signal
      ? AbortSignal.any([AbortSignal.timeout(30000), signal])
      : AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    throw new Error(`AI summary request failed: ${res.status}.`);
  } else if (!res.body) {
    throw new Error('AI summary response has no body.');
  }

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();

  let buffer = '';
  let fullText = '';

  try {
    while (true) {
      const {done, value: chunk} = await reader.read();
      if (done) break;
      buffer += chunk;
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        const delta = processLine(line);
        if (delta) {
          fullText += delta;
          onChunk(fullText);
        }
      }
    }
    const delta = processLine(buffer);
    if (delta) {
      fullText += delta;
      onChunk(fullText);
    }
  } finally {
    reader.releaseLock();
  }

  if (fullText.trim() === '') {
    throw new Error('Unexpected response shape.');
  }

  return fullText;
}
