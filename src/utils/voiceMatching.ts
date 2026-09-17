import {normalizeText} from '@/utils/helpers';

export type AliasIndex = {
  keys: ReadonlyMap<string, string>;
  maxWords: number;
};

type Token = {
  word: string;
  // true when this token is immediately followed by sentence/list punctuation, so a
  // multi-word match may not extend past it into the next token. Hyphens are
  // deliberately excluded - they join compound words like "black-eyed".
  boundary: boolean;
};

// Closes recall gaps found by auditing the algorithm against the real
// veggie/synonym data set.
const VOICE_ALIAS_OVERLAY: ReadonlyMap<string, readonly string[]> = new Map([
  ['pistachio nut', ['pistachio']],
  ['cashew nut', ['cashew']],
  ['pecan nut', ['pecan']],
  ['macadamia nut', ['macadamia']],
  ['chili pepper', ['chili']],
  ['bell pepper', ['pepper']],
  ['corn', ['sweetcorn']],
  ['brussels sprouts', ['brussel sprouts']],
]);

// English-only rules. Localized indices run through them too, which is acceptable because
// they exist as a failsafe for when speech translates poorly - the English index carries
// the recall, so best-effort stemming of localized aliases is by design.
//
// Applied identically to alias words and transcript words, so over-stripping
// (e.g. asparagus -> asparagu) is harmless as long as both sides agree.
const singularizeWord = (word: string): string => {
  if (word === 'chilies') {
    return 'chili';
  }
  let result = word;
  if (/ies$/.test(result)) {
    result = result.replace(/ies$/, 'y');
  } else if (/(ch|sh|s|x|z)es$/.test(result)) {
    result = result.replace(/es$/, '');
  } else if (/oes$/.test(result)) {
    result = result.replace(/oes$/, 'o');
  } else if (/[^s]s$/.test(result)) {
    result = result.replace(/s$/, '');
  }
  return result.length >= 3 ? result : word;
};

const splitWords = (text: string): string[] =>
  text.split(/[^\p{L}\p{N}]+/u).filter((word) => word.length > 0);

// Words are joined without a separator on purpose: a compound said as two words then keys
// the same as the single-word alias, so "chick peas" reaches chickpea instead of falling
// back to the generic "pea".
const buildKey = (words: readonly string[]): string =>
  words
    .map((word, index) => {
      const normalized = normalizeText(word);
      return index === words.length - 1 ? singularizeWord(normalized) : normalized;
    })
    .join('');

export const buildAliasIndex = (
  veggies: readonly string[],
  getName: (veggie: string) => string,
  getSynonyms: (veggie: string) => readonly string[],
): AliasIndex => {
  const keys = new Map<string, string>();
  let maxWords = 1;

  for (const veggie of veggies) {
    const aliases = [
      veggie,
      getName(veggie),
      ...getSynonyms(veggie),
      ...(VOICE_ALIAS_OVERLAY.get(veggie) ?? []),
    ].filter((alias) => alias?.trim());

    for (const alias of aliases) {
      const words = splitWords(alias);
      if (words.length === 0) {
        continue;
      }
      const key = buildKey(words);
      keys.set(key, veggie);
      maxWords = Math.max(maxWords, words.length);
    }
  }

  return {keys, maxWords};
};

// Conjunctions are left as ordinary (non-matching) tokens rather than flagged as
// boundaries: since no alias key contains "and"/"or"/etc, a span that would need to
// include one as an interior word already fails to match, which is sufficient to
// separate the veggies on either side.
const WORD_WITH_TRAILING_SEPARATOR = /([\p{L}\p{N}]+)([^\p{L}\p{N}]*)/gu;

const tokenize = (transcript: string): Token[] =>
  [...transcript.matchAll(WORD_WITH_TRAILING_SEPARATOR)].map(([, word, separator]) => ({
    word,
    boundary: /[,;:.!?]/.test(separator),
  }));

// Matching is bag-of-words: a veggie word used in a non-food sense ("up to date") is an
// accepted false positive, since the alternative needs sentence-level understanding.
export const matchVeggies = (transcript: string, index: AliasIndex): string[] => {
  const tokens = tokenize(transcript);
  const matched = new Set<string>();

  let i = 0;
  while (i < tokens.length) {
    let matchedLength = 0;
    for (let n = Math.min(index.maxWords, tokens.length - i); n >= 1; n--) {
      const span = tokens.slice(i, i + n);
      // A boundary token can only be the final word of a span - the phrase break
      // after it means the span cannot continue into the next token.
      const crossesBoundary = span.slice(0, -1).some((token) => token.boundary);
      if (crossesBoundary) {
        continue;
      }
      const key = buildKey(span.map((token) => token.word));
      const veggie = index.keys.get(key);
      if (veggie) {
        matched.add(veggie);
        matchedLength = n;
        break;
      }
    }
    i += matchedLength > 0 ? matchedLength : 1;
  }

  return [...matched];
};
