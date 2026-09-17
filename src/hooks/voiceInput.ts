import {onUnmounted, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {filter, forEach, join, map, pipe} from 'remeda';
import {SonioxClient} from '@soniox/client';
import {useI18n} from 'vue-i18n';
import {getTranscribeToken} from '@/api';
import {useAppStateStore} from '@/stores/appStateStore';
import {useAvailableVeggies} from '@/hooks/availableVeggies';
import {buildAliasIndex, matchVeggies, type AliasIndex} from '@/utils/voiceMatching';
import {DEFAULT_LOCALE} from '@/utils/constants';

type VoiceInputState = 'idle' | 'requesting' | 'listening' | 'error';
export type TranslationStatus = 'original' | 'translation' | 'none';

export function useVoiceInput() {
  const {t, tm} = useI18n();
  const {settings} = storeToRefs(useAppStateStore());
  const {availableVeggies} = useAvailableVeggies();

  const state = ref<VoiceInputState>('idle');
  const matchedVeggies = ref(new Set<string>());

  type Recording = ReturnType<SonioxClient['realtime']['record']>;

  let controller: AbortController | undefined;
  let recording: Recording | undefined;

  // Speech the API did not have to translate - the user already spoke the target language -
  // comes back untranslated with a 'none' status, so it belongs to the English stream.
  const ENGLISH_STATUSES: readonly TranslationStatus[] = ['translation', 'none'];

  const buildIndices = async (): Promise<
    ReadonlyArray<[statuses: readonly TranslationStatus[], index: AliasIndex]>
  > => {
    // en.json is not guaranteed to be loaded into the i18n instance - App.vue only loads
    // the active locale.
    const en = await import('@/i18n/en.json');
    const englishIndex = buildAliasIndex(
      availableVeggies.value,
      (veggie) => en.veggies[veggie as keyof typeof en.veggies] as string,
      (veggie) => en.synonyms[veggie as keyof typeof en.synonyms] ?? [],
    );
    if (settings.value.locale === DEFAULT_LOCALE) {
      return [[ENGLISH_STATUSES, englishIndex]];
    }
    const localeIndex = buildAliasIndex(
      availableVeggies.value,
      (veggie) => t(`veggies.${veggie}`),
      (veggie) => Object.values<string>(tm(`synonyms.${veggie}`)),
    );
    return [
      [['original'], localeIndex],
      [ENGLISH_STATUSES, englishIndex],
    ];
  };

  const buildLanguageHints = (): string[] => {
    const hints = [settings.value.locale, ...navigator.languages.map((tag) => tag.split('-')[0])];
    return [...new Set([...hints, DEFAULT_LOCALE])];
  };

  const requestMicrophonePermission = async (): Promise<boolean> => {
    try {
      const permissionStream = await navigator.mediaDevices.getUserMedia({audio: true});
      permissionStream.getTracks().forEach((track) => track.stop());
      return true;
    } catch {
      return false;
    }
  };

  const cleanupRecording = () => {
    recording?.cancel();
    recording = undefined;
    controller?.abort();
    controller = undefined;
  };

  const start = async (transcribeToken: string) => {
    cleanupRecording();
    state.value = 'requesting';

    controller = new AbortController();
    const {signal} = controller;

    const [hasPermission, indices] = await Promise.all([
      requestMicrophonePermission(),
      buildIndices(),
    ]);
    if (signal.aborted || !hasPermission) {
      state.value = 'error';
      return;
    }

    const client = new SonioxClient({
      config: async () => ({api_key: await getTranscribeToken(transcribeToken, signal)}),
    });

    recording = client.realtime.record({
      model: 'stt-rt-v5',
      language_hints: buildLanguageHints(),
      translation: {type: 'one_way', target_language: DEFAULT_LOCALE},
      enable_endpoint_detection: true,
      endpoint_sensitivity: -0.3,
      context: {
        text: 'The user is describing what they have eaten, which should be mostly plant-based ingredients.',
      },
    });

    recording.on('result', (result) => {
      indices.forEach(([statuses, index]) => {
        pipe(
          result.tokens,
          filter(
            (token) =>
              token.is_final && statuses.includes(token.translation_status as TranslationStatus),
          ),
          map((token) => token.text),
          join(''),
          (text) => matchVeggies(text, index),
          forEach((veggie) => matchedVeggies.value.add(veggie)),
        );
      });
    });

    recording.on('endpoint', () => {
      void stop();
    });

    recording.on('error', () => {
      cleanupRecording();
      state.value = 'error';
    });

    state.value = 'listening';
  };

  const stop = async () => {
    try {
      // Resolves only once the server has flushed the final results, so stay in
      // the listening state until then - matches still arrive during the flush.
      await recording?.stop();
      state.value = 'idle';
    } catch {
      state.value = 'error';
    }
  };

  const reset = () => {
    cleanupRecording();
    state.value = 'idle';
    matchedVeggies.value.clear();
  };

  onUnmounted(cleanupRecording);

  return {
    state,
    matchedVeggies,
    start,
    stop,
    reset,
  };
}
