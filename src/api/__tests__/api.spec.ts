import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {getAISummary} from '@/api';
import {getWeekData} from '@/test-utils';
import {AI_SUMMARY_URL} from '@/utils/constants';

const sseFrame = (data: string, event?: string) =>
  `${event ? `event: ${event}\n` : ''}data: ${data}\n\n`;

const delta = (text: string) =>
  sseFrame(JSON.stringify({type: 'content_block_delta', delta: {text}}), 'content_block_delta');

// Left open (close: false), the stream only ends if the consumer cancels it
const createStream = (chunks: string[], {onCancel = vi.fn(), close = true} = {}) => {
  const encoder = new TextEncoder();
  const queue = [...chunks];
  return new ReadableStream<Uint8Array>({
    pull(controller) {
      const chunk = queue.shift();
      if (chunk !== undefined) {
        controller.enqueue(encoder.encode(chunk));
      } else if (close) {
        controller.close();
      }
    },
    cancel: onCancel,
  });
};

describe('getAISummary', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const createMockResponse = (ok: boolean, body: ReadableStream | null = null): Response =>
    ({
      ok,
      body,
      status: ok ? 200 : 500,
    }) as Response;

  it('handles successful stream with incremental chunks, skips malformed/wrong-type events, and cancels on [DONE]', async () => {
    const onChunk = vi.fn();
    const onCancel = vi.fn();
    const weekData = getWeekData();
    const signal = new AbortController().signal;
    const body = createStream(
      [
        delta('Hello '),
        sseFrame('not valid json'),
        sseFrame(JSON.stringify({type: 'message_start'}), 'message_start'),
        delta('World'),
        sseFrame('[DONE]'),
        delta('ignored'),
      ],
      {onCancel, close: false},
    );

    mockFetch.mockResolvedValueOnce(createMockResponse(true, body));

    const result = await getAISummary(weekData, 'test-token', onChunk, signal);

    // onChunk called exactly twice with cumulative text
    expect(onChunk).toHaveBeenCalledTimes(2);
    expect(onChunk).toHaveBeenNthCalledWith(1, 'Hello ');
    expect(onChunk).toHaveBeenNthCalledWith(2, 'Hello World');

    // Stream cancelled on [DONE]
    await vi.waitFor(() => expect(onCancel).toHaveBeenCalled());

    expect(result).toBe('Hello World');
  });

  it('constructs request with correct headers, body, and combined abort signal', async () => {
    const onChunk = vi.fn();
    const weekData = getWeekData();
    const controller = new AbortController();

    mockFetch.mockResolvedValueOnce(
      createMockResponse(true, createStream([delta('text'), sseFrame('[DONE]')])),
    );

    await getAISummary(weekData, 'test-token', onChunk, controller.signal);

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, options] = mockFetch.mock.calls[0] as [
      string,
      RequestInit & {headers: Record<string, string>},
    ];

    expect(url).toBe(AI_SUMMARY_URL);
    expect(options.method).toBe('POST');
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(options.headers['CF-Turnstile-Token']).toBe('test-token');
    expect(options.body).toBe(JSON.stringify(weekData));
    expect(options.signal).toBeInstanceOf(AbortSignal);
  });

  it('throws when res.ok is false', async () => {
    const onChunk = vi.fn();
    const weekData = getWeekData();
    const signal = new AbortController().signal;

    mockFetch.mockResolvedValueOnce(createMockResponse(false, createStream([delta('text')])));

    await expect(getAISummary(weekData, 'token', onChunk, signal)).rejects.toThrow(
      'AI summary request failed: 500.',
    );

    expect(onChunk).not.toHaveBeenCalled();
  });

  it('throws when res.body is null', async () => {
    const onChunk = vi.fn();
    const weekData = getWeekData();
    const signal = new AbortController().signal;

    mockFetch.mockResolvedValueOnce(createMockResponse(true, null));

    await expect(getAISummary(weekData, 'token', onChunk, signal)).rejects.toThrow(
      'AI summary response has no body.',
    );
  });

  it('throws when stream returns only whitespace (empty result)', async () => {
    const onChunk = vi.fn();
    const weekData = getWeekData();
    const signal = new AbortController().signal;
    const body = createStream([
      sseFrame(JSON.stringify({type: 'message_start'}), 'message_start'),
      delta('   '),
    ]);

    mockFetch.mockResolvedValueOnce(createMockResponse(true, body));

    await expect(getAISummary(weekData, 'token', onChunk, signal)).rejects.toThrow(
      'No content received from API.',
    );
  });
});
