import {describe, it, expect, beforeEach, vi} from 'vitest';
import {getAISummary} from '@/api';
import {getWeekData} from '@/test-utils';
import {AI_SUMMARY_URL} from '@/utils/constants';

type MockReader = {
  read: ReturnType<typeof vi.fn>;
  cancel: ReturnType<typeof vi.fn>;
  releaseLock: ReturnType<typeof vi.fn>;
};

type MockStream = {
  pipeThrough: ReturnType<typeof vi.fn>;
  getReader: ReturnType<typeof vi.fn>;
};

describe('getAISummary', () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let mockReader: MockReader;
  let mockStream: MockStream;

  beforeEach(() => {
    mockReader = {
      read: vi.fn(),
      cancel: vi.fn(),
      releaseLock: vi.fn(),
    };

    mockStream = {
      pipeThrough: vi.fn().mockReturnThis(),
      getReader: vi.fn().mockReturnValue(mockReader),
    };

    mockFetch = vi.fn();
    global.fetch = mockFetch;
  });

  const createMockResponse = (ok: boolean, body: unknown = null): Response =>
    ({
      ok,
      body,
      status: ok ? 200 : 500,
    }) as Response;

  it('handles successful stream with incremental chunks, skips malformed/wrong-type events, and cancels on [DONE]', async () => {
    const onChunk = vi.fn();
    const weekData = getWeekData();
    const signal = new AbortController().signal;

    // Sequence of events: valid delta, malformed JSON, wrong type, valid delta, [DONE]
    mockReader.read
      .mockResolvedValueOnce({
        done: false,
        value: {data: JSON.stringify({type: 'content_block_delta', delta: {text: 'Hello '}})},
      })
      .mockResolvedValueOnce({
        done: false,
        value: {data: 'not valid json'},
      })
      .mockResolvedValueOnce({
        done: false,
        value: {data: JSON.stringify({type: 'message_start'})},
      })
      .mockResolvedValueOnce({
        done: false,
        value: {data: JSON.stringify({type: 'content_block_delta', delta: {text: 'World'}})},
      })
      .mockResolvedValueOnce({
        done: false,
        value: {data: '[DONE]'},
      })
      .mockResolvedValueOnce({done: true});

    mockFetch.mockResolvedValueOnce(createMockResponse(true, mockStream));

    const result = await getAISummary(weekData, 'test-token', onChunk, signal);

    // onChunk called exactly twice with cumulative text
    expect(onChunk).toHaveBeenCalledTimes(2);
    expect(onChunk).toHaveBeenNthCalledWith(1, 'Hello ');
    expect(onChunk).toHaveBeenNthCalledWith(2, 'Hello World');

    // Reader cancelled on [DONE]
    expect(mockReader.cancel).toHaveBeenCalled();
    expect(mockReader.releaseLock).toHaveBeenCalled();

    expect(result).toBe('Hello World');
  });

  it('constructs request with correct headers, body, and combined abort signal', async () => {
    const onChunk = vi.fn();
    const weekData = getWeekData();
    const controller = new AbortController();

    mockReader.read.mockResolvedValueOnce({
      done: false,
      value: {data: JSON.stringify({type: 'content_block_delta', delta: {text: 'text'}})},
    });
    mockReader.read.mockResolvedValueOnce({
      done: false,
      value: {data: '[DONE]'},
    });

    mockFetch.mockResolvedValueOnce(createMockResponse(true, mockStream));

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
  });

  it('throws when res.ok is false', async () => {
    const onChunk = vi.fn();
    const weekData = getWeekData();
    const signal = new AbortController().signal;

    mockFetch.mockResolvedValueOnce(createMockResponse(false));

    await expect(getAISummary(weekData, 'token', onChunk, signal)).rejects.toThrow(
      'AI summary request failed: 500.',
    );

    expect(mockStream.getReader).not.toHaveBeenCalled();
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

    mockReader.read
      .mockResolvedValueOnce({
        done: false,
        value: {data: JSON.stringify({type: 'message_start'})},
      })
      .mockResolvedValueOnce({done: true});

    mockFetch.mockResolvedValueOnce(createMockResponse(true, mockStream));

    await expect(getAISummary(weekData, 'token', onChunk, signal)).rejects.toThrow(
      'No content received from API.',
    );
    expect(mockReader.releaseLock).toHaveBeenCalled();
  });
});
