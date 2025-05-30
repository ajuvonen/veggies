import type {DateTime} from 'luxon';

export type Locale = 'en' | 'fi';

export enum Category {
  Fruit = 'Fruit',
  Vegetable = 'Vegetable',
  Leafy = 'Leafy',
  Root = 'Root',
  Bean = 'Bean',
  Grain = 'Grain',
  Mushroom = 'Mushroom',
}

export type Favorites = {
  [key in Category]: [string, number][];
};

export type Week = {
  veggies: string[];
  startDate: DateTime;
};

export type Challenge = {
  startDate: DateTime;
  veggie: string;
};

export type Settings = {
  disableAnimations: boolean;
  locale: Locale;
  suggestionCount: number;
};

export type Listing = {
  veggie: string;
  category: Category;
};

export type TranslatedListing = Listing & {
  translation: string;
  synonyms: string[];
};

export enum AchievementLevel {
  NoAchievement,
  Bronze,
  Silver,
  Gold,
  Platinum,
}

export type Achievements = {
  allOnRed: AchievementLevel;
  botanicalBerries: AchievementLevel;
  challengeAccepted: AchievementLevel;
  committed: AchievementLevel;
  completionist: AchievementLevel;
  experimenterBean: AchievementLevel;
  experimenterFruit: AchievementLevel;
  experimenterGrain: AchievementLevel;
  experimenterLeafy: AchievementLevel;
  experimenterMushroom: AchievementLevel;
  experimenterRoot: AchievementLevel;
  experimenterVegetable: AchievementLevel;
  goNuts: AchievementLevel;
  hotStreak: AchievementLevel;
  thirtyVeggies: AchievementLevel;
  thousandsOdd: AchievementLevel;
  thousandsEven: AchievementLevel;
};
