import {describe, it, expect, vi, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import {withSetup} from '@/test-utils';
import type {RecordOptions} from '@soniox/client';
import {useVoiceInput, type TranslationStatus} from '@/hooks/voiceInput';
import {useAppStateStore} from '@/stores/appStateStore';

const mocks = vi.hoisted(() => ({
  getTranscribeToken: vi.fn(() => Promise.resolve('token')),
  buildAliasIndex: vi.fn(() => ({})),
  matchVeggies: vi.fn((): string[] => []),
  t: vi.fn((key: string) => key),
  tm: vi.fn(() => ({})),
}));

vi.mock('@/api', () => ({
  getTranscribeToken: mocks.getTranscribeToken,
}));

vi.mock('@/utils/voiceMatching', () => ({
  buildAliasIndex: mocks.buildAliasIndex,
  matchVeggies: mocks.matchVeggies,
}));

vi.mock('@/i18n/en.json', () => ({
  default: {
    veggies: {carrot: 'Carrot'},
    synonyms: {},
  },
}));

vi.mock('vue-i18n', async () => ({
  ...(await vi.importActual('vue-i18n')),
  useI18n: () => ({t: mocks.t, tm: mocks.tm}),
}));

type FakeRecording = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlers: Record<string, (...args: any[]) => void>;
  on: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
  cancel: ReturnType<typeof vi.fn>;
};

const sonioxMocks = vi.hoisted(() => {
  const recordings: FakeRecording[] = [];
  const record = vi.fn((options: RecordOptions): FakeRecording => {
    void options;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlers: Record<string, (...args: any[]) => void> = {};
    const recording: FakeRecording = {
      handlers,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      on: vi.fn((event: string, cb: (...args: any[]) => void) => {
        handlers[event] = cb;
        return recording;
      }),
      stop: vi.fn(() => Promise.resolve()),
      cancel: vi.fn(),
    };
    recordings.push(recording);
    return recording;
  });
  const SonioxClientCtor = vi.fn(function SonioxClient() {
    return {realtime: {record}};
  });
  return {recordings, record, SonioxClientCtor};
});
vi.mock('@soniox/client', () => ({
  SonioxClient: sonioxMocks.SonioxClientCtor,
}));

const makeMediaStream = () => {
  const track = {stop: vi.fn()};
  return {stream: {getTracks: () => [track]} as unknown as MediaStream, track};
};

const stubGetUserMedia = (impl: () => Promise<MediaStream>) => {
  Object.defineProperty(navigator, 'mediaDevices', {
    value: {getUserMedia: vi.fn(impl)},
    configurable: true,
  });
};

const stubLanguages = (languages: string[]) => {
  Object.defineProperty(navigator, 'languages', {value: languages, configurable: true});
};

const finalToken = (text: string, translationStatus: TranslationStatus) => ({
  text,
  is_final: true,
  translation_status: translationStatus,
});

const mountHook = () => {
  let result!: ReturnType<typeof useVoiceInput>;
  const wrapper = mount({
    setup() {
      result = useVoiceInput();
      return () => null;
    },
  });
  return {...result, wrapper};
};

describe('useVoiceInput', () => {
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    sonioxMocks.recordings.length = 0;
    appStateStore = useAppStateStore();
    stubGetUserMedia(() => Promise.resolve(makeMediaStream().stream));
    stubLanguages(['en-GB']);
  });

  it('transitions requesting -> listening and stops the permission-check stream', async () => {
    const {stream, track} = makeMediaStream();
    stubGetUserMedia(() => Promise.resolve(stream));

    const {state, start} = withSetup(useVoiceInput);
    const startPromise = start('test-token');
    expect(state.value).toBe('requesting');
    await startPromise;

    expect(state.value).toBe('listening');
    expect(track.stop).toHaveBeenCalledTimes(1);
  });

  it('sets state to error and never creates a recording when permission is denied', async () => {
    stubGetUserMedia(() => Promise.reject(new Error('denied')));

    const {state, start} = withSetup(useVoiceInput);
    await start('test-token');

    expect(state.value).toBe('error');
    expect(sonioxMocks.SonioxClientCtor).not.toHaveBeenCalled();
  });

  it('skips the locale index and only matches English text for the default locale', async () => {
    appStateStore.settings.locale = 'en';
    const {start} = withSetup(useVoiceInput);
    await start('test-token');

    expect(mocks.buildAliasIndex).toHaveBeenCalledTimes(1);
    const englishIndex = mocks.buildAliasIndex.mock.results[0]?.value;

    const recording = sonioxMocks.recordings[0];
    recording.handlers.result({
      tokens: [finalToken('porkkana', 'original'), finalToken('carrot', 'translation')],
    });

    expect(mocks.matchVeggies).toHaveBeenCalledTimes(1);
    expect(mocks.matchVeggies).toHaveBeenCalledWith('carrot', englishIndex);
  });

  it('matches untranslated English speech against the English index', async () => {
    appStateStore.settings.locale = 'en';
    const {start} = withSetup(useVoiceInput);
    await start('test-token');

    const englishIndex = mocks.buildAliasIndex.mock.results[0]?.value;

    sonioxMocks.recordings[0].handlers.result({tokens: [finalToken('carrot', 'none')]});

    expect(mocks.matchVeggies).toHaveBeenCalledTimes(1);
    expect(mocks.matchVeggies).toHaveBeenCalledWith('carrot', englishIndex);
  });

  it('builds a locale index and matches both streams for a non-default locale', async () => {
    appStateStore.settings.locale = 'fi';
    const {start} = withSetup(useVoiceInput);
    await start('test-token');

    expect(mocks.buildAliasIndex).toHaveBeenCalledTimes(2);
    const englishIndex = mocks.buildAliasIndex.mock.results[0]?.value;
    const localeIndex = mocks.buildAliasIndex.mock.results[1]?.value;

    const recording = sonioxMocks.recordings[0];
    recording.handlers.result({
      tokens: [finalToken('porkkana', 'original'), finalToken('carrot', 'translation')],
    });

    expect(mocks.matchVeggies).toHaveBeenCalledTimes(2);
    expect(mocks.matchVeggies).toHaveBeenNthCalledWith(1, 'porkkana', localeIndex);
    expect(mocks.matchVeggies).toHaveBeenNthCalledWith(2, 'carrot', englishIndex);
  });

  it('joins translated and untranslated English tokens into one stream', async () => {
    appStateStore.settings.locale = 'fi';
    const {start} = withSetup(useVoiceInput);
    await start('test-token');

    const englishIndex = mocks.buildAliasIndex.mock.results[0]?.value;
    const localeIndex = mocks.buildAliasIndex.mock.results[1]?.value;

    sonioxMocks.recordings[0].handlers.result({
      tokens: [
        finalToken('porkkana', 'original'),
        finalToken('carrot', 'translation'),
        finalToken(' and broccoli', 'none'),
      ],
    });

    expect(mocks.matchVeggies).toHaveBeenCalledTimes(2);
    expect(mocks.matchVeggies).toHaveBeenNthCalledWith(1, 'porkkana', localeIndex);
    expect(mocks.matchVeggies).toHaveBeenNthCalledWith(2, 'carrot and broccoli', englishIndex);
  });

  it('joins only final tokens, split by translation status', async () => {
    appStateStore.settings.locale = 'fi';
    const {start} = withSetup(useVoiceInput);
    await start('test-token');

    const recording = sonioxMocks.recordings[0];
    recording.handlers.result({
      tokens: [
        finalToken('a', 'original'),
        {text: 'b', is_final: false, translation_status: 'original'},
        finalToken('c', 'translation'),
        finalToken('d', 'original'),
      ],
    });

    expect(mocks.matchVeggies).toHaveBeenNthCalledWith(1, 'ad', expect.anything());
    expect(mocks.matchVeggies).toHaveBeenNthCalledWith(2, 'c', expect.anything());
  });

  it('appends newly matched veggies', async () => {
    const {matchedVeggies, start} = withSetup(useVoiceInput);
    await start('test-token');

    mocks.matchVeggies.mockReturnValueOnce(['carrot', 'pea']);
    sonioxMocks.recordings[0].handlers.result({
      tokens: [finalToken('carrot pea', 'translation')],
    });

    expect(matchedVeggies.value).toEqual(new Set(['carrot', 'pea']));
  });

  it('does not duplicate an already matched veggie', async () => {
    const {matchedVeggies, start} = withSetup(useVoiceInput);
    await start('test-token');

    const recording = sonioxMocks.recordings[0];
    mocks.matchVeggies.mockReturnValueOnce(['carrot']);
    recording.handlers.result({tokens: [finalToken('carrot', 'translation')]});

    mocks.matchVeggies.mockReturnValueOnce(['carrot', 'pea']);
    recording.handlers.result({tokens: [finalToken('carrot pea', 'translation')]});

    expect(matchedVeggies.value).toEqual(new Set(['carrot', 'pea']));
  });

  it('adds a veggie only once when both the locale and English streams match it', async () => {
    appStateStore.settings.locale = 'fi';
    const {matchedVeggies, start} = withSetup(useVoiceInput);
    await start('test-token');

    mocks.matchVeggies.mockReturnValueOnce(['carrot']).mockReturnValueOnce(['carrot']);
    sonioxMocks.recordings[0].handlers.result({
      tokens: [finalToken('porkkana', 'original'), finalToken('carrot', 'translation')],
    });

    expect(matchedVeggies.value).toEqual(new Set(['carrot']));
  });

  it('stops the recording and sets state to idle on endpoint', async () => {
    const {state, start} = withSetup(useVoiceInput);
    await start('test-token');

    const recording = sonioxMocks.recordings[0];
    recording.handlers.endpoint();

    expect(recording.stop).toHaveBeenCalledTimes(1);
    expect(state.value).toBe('listening');

    await vi.waitFor(() => expect(state.value).toBe('idle'));
  });

  it('sets state to error on an error event', async () => {
    const {state, start} = withSetup(useVoiceInput);
    await start('test-token');

    sonioxMocks.recordings[0].handlers.error(new Error('boom'));

    expect(state.value).toBe('error');
  });

  it('stop() stops the recording, sets idle, and keeps existing matches', async () => {
    const {state, matchedVeggies, start, stop} = withSetup(useVoiceInput);
    await start('test-token');

    mocks.matchVeggies.mockReturnValueOnce(['carrot']);
    const recording = sonioxMocks.recordings[0];
    recording.handlers.result({tokens: [finalToken('carrot', 'translation')]});

    await stop();

    expect(recording.stop).toHaveBeenCalledTimes(1);
    expect(state.value).toBe('idle');
    expect(matchedVeggies.value).toEqual(new Set(['carrot']));
  });

  it('stays listening until the final results are flushed', async () => {
    const {state, matchedVeggies, start, stop} = withSetup(useVoiceInput);
    await start('test-token');

    let flush!: () => void;
    const recording = sonioxMocks.recordings[0];
    recording.stop.mockReturnValueOnce(
      new Promise<void>((resolve) => {
        flush = resolve;
      }),
    );

    const stopPromise = stop();
    expect(state.value).toBe('listening');

    mocks.matchVeggies.mockReturnValueOnce(['carrot']);
    recording.handlers.result({tokens: [finalToken('carrot', 'translation')]});

    flush();
    await stopPromise;

    expect(state.value).toBe('idle');
    expect(matchedVeggies.value).toEqual(new Set(['carrot']));
  });

  it('sets state to error when stopping rejects', async () => {
    const {state, start, stop} = withSetup(useVoiceInput);
    await start('test-token');

    sonioxMocks.recordings[0].stop.mockRejectedValueOnce(new Error('connection lost'));
    await stop();

    expect(state.value).toBe('error');
  });

  it('reset() cancels the recording, sets idle, and clears matches', async () => {
    const {state, matchedVeggies, start, reset} = withSetup(useVoiceInput);
    await start('test-token');

    mocks.matchVeggies.mockReturnValueOnce(['carrot']);
    const recording = sonioxMocks.recordings[0];
    recording.handlers.result({tokens: [finalToken('carrot', 'translation')]});

    reset();

    expect(recording.cancel).toHaveBeenCalledTimes(1);
    expect(state.value).toBe('idle');
    expect(matchedVeggies.value).toEqual(new Set());
  });

  it('cleans up the previous recording when start() is called again', async () => {
    const {start} = withSetup(useVoiceInput);
    await start('test-token');
    const firstRecording = sonioxMocks.recordings[0];

    await start('test-token');

    expect(firstRecording.cancel).toHaveBeenCalledTimes(1);
    expect(sonioxMocks.recordings).toHaveLength(2);
  });

  it('cleans up the active recording when the host component unmounts', async () => {
    const {start, wrapper} = mountHook();
    await start('test-token');
    const recording = sonioxMocks.recordings[0];

    wrapper.unmount();

    expect(recording.cancel).toHaveBeenCalledTimes(1);
  });

  it('includes settings locale, navigator languages, and DEFAULT_LOCALE, deduped', async () => {
    appStateStore.settings.locale = 'fi';
    stubLanguages(['fi-FI', 'en-US']);

    const {start} = withSetup(useVoiceInput);
    await start('test-token');

    expect(sonioxMocks.record.mock.calls[0]?.[0].language_hints).toEqual(['fi', 'en']);
  });
});
