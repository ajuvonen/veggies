import {describe, it, expect} from 'vitest';
import {ALL_VEGGIES} from '@/utils/veggieDetails';
import {buildAliasIndex, matchVeggies} from '@/utils/voiceMatching';
import en from '@/i18n/en.json';

const getName = (veggie: string): string => (en.veggies as Record<string, string>)[veggie];
const getSynonyms = (veggie: string): string[] =>
  (en.synonyms as Record<string, string[]>)[veggie] ?? [];

const fullIndex = buildAliasIndex(ALL_VEGGIES, getName, getSynonyms);

const match = (transcript: string) => matchVeggies(transcript, fullIndex);

describe('voiceMatching', () => {
  describe('buildAliasIndex', () => {
    it('produces no collisions between distinct veggie ids', () => {
      const idsByKey = new Map<string, Set<string>>();
      for (const [key, id] of fullIndex.keys) {
        const ids = idsByKey.get(key) ?? new Set<string>();
        ids.add(id);
        idsByKey.set(key, ids);
      }
      for (const [key, ids] of idsByKey) {
        expect(ids.size, `key "${key}" maps to multiple ids: ${[...ids].join(', ')}`).toBe(1);
      }
    });

    it('derives maxWords wide enough to match the longest alias in the data', () => {
      expect(match('black trumpet mushrooms')).toEqual(['black trumpet mushroom']);
      expect(match('scarlet runner beans')).toEqual(['scarlet runner bean']);
    });

    it('excludes allergens from the index', () => {
      const restricted = buildAliasIndex(
        ALL_VEGGIES.filter((v) => v !== 'carrot'),
        getName,
        getSynonyms,
      );
      expect(matchVeggies('I ate a carrot', restricted)).toEqual([]);
    });

    it('never matches an empty-string synonym placeholder', () => {
      expect(match('')).toEqual([]);
    });
  });

  describe('matchVeggies', () => {
    it('matches sweet potato and not potato', () => {
      expect(match('I had sweet potatoes')).toEqual(['sweet potato']);
    });

    it('matches both potato and sweet potato when both are said', () => {
      expect(match('potatoes and sweet potatoes')).toEqual(['potato', 'sweet potato']);
    });

    it('matches compounds correctly through commas and a period', () => {
      expect(match('I had sweet potatoes, red onions and some black-eyed peas.')).toEqual([
        'sweet potato',
        'red onion',
        'black-eyed pea',
      ]);
    });

    it('handles a colon as a separator', () => {
      expect(match('30 veggies: apple, pear, fig')).toEqual(['apple', 'pear', 'fig']);
    });

    it('does not merge separately listed cherry and tomato into cherry tomato', () => {
      expect(match('cherries, tomatoes, cucumber')).toEqual(['cherry', 'tomato', 'cucumber']);
    });

    it('still matches the cherry tomato compound when said together', () => {
      expect(match('cherry tomatoes')).toEqual(['cherry tomato']);
    });

    it('does not merge separately listed pea and sprouts into pea sprouts', () => {
      expect(match('peas, sprouts and carrots')).toEqual(['pea', 'sprouts', 'carrot']);
    });

    it('still matches the pea sprouts compound when said together', () => {
      expect(match('pea sprouts')).toEqual(['pea sprouts']);
    });

    it('finds onion', () => {
      expect(match('I had an onion')).toEqual(['onion']);
    });

    it('does not merge yam and bean sprouts into jicama', () => {
      expect(match('yam, bean sprouts')).toEqual(['yam', 'sprouts']);
    });

    it('consumes the longest match without backtracking into a shorter overlap', () => {
      // "snow pea" wins at the first token, leaving "sprouts" - "pea sprouts" is never tried.
      expect(match('snow pea sprouts')).toEqual(['snow pea', 'sprouts']);
    });
  });

  it.each([
    ['chick peas', 'chickpea'],
    ['pea nuts', 'peanut'],
    ['grape fruit', 'grapefruit'],
    ['pine apple', 'pineapple'],
    ['lemon grass', 'lemongrass'],
    ['horse radish', 'horseradish'],
    ['buck wheat', 'buckwheat'],
    ['soy beans', 'soybean'],
    ['black currants', 'blackcurrant'],
    ['hazel nuts', 'hazelnut'],
    ['egg plant', 'eggplant'],
    ['water melon', 'watermelon'],
    ['butter nut squash', 'butternut squash'],
    ['brussel sprouts', 'brussels sprouts'],
    ["brussel's sprouts", 'brussels sprouts'],
  ])('matches "%s" as %s rather than the generic tail word', (transcript, expected) => {
    expect(match(transcript)).toEqual([expected]);
  });

  it('still matches the single-word spelling', () => {
    expect(match('chickpeas and peanuts')).toEqual(['chickpea', 'peanut']);
  });

  it('ignores case and folds diacritics', () => {
    expect(match('JALAPEÑOS and jalapenos')).toEqual(['jalapeno']);
    expect(match('TOMATOES')).toEqual(['tomato']);
  });

  it('treats semicolons, exclamation marks and question marks as phrase breaks', () => {
    expect(match('apples; pears? figs!')).toEqual(['apple', 'pear', 'fig']);
    expect(match('cherry; tomatoes')).toEqual(['cherry', 'tomato']);
  });

  it.each(['   ', '...', '!?,;:'])('returns no matches for %j', (transcript) => {
    expect(match(transcript)).toEqual([]);
  });

  it('matches wild rice and rice separately', () => {
    expect(match('wild rice and rice')).toEqual(['wild rice', 'rice']);
  });

  it('matches black bean and black lentil separately', () => {
    expect(match('black beans and black lentils')).toEqual(['black bean', 'black lentil']);
  });

  it('matches chili pepper and bell pepper separately', () => {
    expect(match('chili peppers and bell peppers')).toEqual(['chili pepper', 'bell pepper']);
  });

  it('matches lemon balm and lemon separately', () => {
    expect(match('lemon balm tea with lemon')).toEqual(['lemon balm', 'lemon']);
  });

  it('matches napa cabbage, red cabbage and cabbage separately', () => {
    expect(match('napa cabbage, red cabbage and cabbage')).toEqual([
      'napa cabbage',
      'red cabbage',
      'cabbage',
    ]);
  });

  it('matches bare nut names', () => {
    expect(match('pistachios, cashews and pecans')).toEqual([
      'pistachio nut',
      'cashew nut',
      'pecan nut',
    ]);
  });

  it('matches synonym aliases', () => {
    expect(match('nashi')).toEqual(['asian pear']);
    expect(match('pak choi')).toEqual(['bok choy']);
  });

  it('matches common plural forms', () => {
    expect(match('carrots')).toEqual(['carrot']);
    expect(match('tomatoes')).toEqual(['tomato']);
    expect(match('peas')).toEqual(['pea']);
    expect(match('cherries')).toEqual(['cherry']);
    expect(match('chilies')).toEqual(['chili pepper']);
    expect(match('bell peppers')).toEqual(['bell pepper']);
  });

  it('returns each matched veggie only once', () => {
    expect(match('up to date, no dates involved')).toEqual(['date']);
  });

  it('does not guess a specific veggie from a vague term', () => {
    expect(match('lentils, beans, nuts and seeds')).toEqual([]);
  });

  it('returns an empty array for filler with no veggies', () => {
    expect(match('I had a lovely meal today')).toEqual([]);
  });
});
