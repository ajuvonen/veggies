import type {DateTime} from 'luxon';

export type Locale = 'en' | 'fi';

export type AchievementProps = {
  completedChallenges: number;
  favorites: Favorites;
  hotStreakLength: number;
  totalWeeks: number;
  uniqueVeggies: string[];
  veggiesThisWeek: number;
};

export enum Category {
  Fruit = 'Fruit',
  Vegetable = 'Vegetable',
  Leafy = 'Leafy',
  Root = 'Root',
  Bean = 'Bean',
  Grain = 'Grain',
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
  locale: Locale;
  suggestionCount: number;
};

export type Listing = {
  veggie: string;
  category: Category;
};

export type TranslatedListing = Listing & {
  translation: string;
};

export enum AchievementLevel {
  NoAchievement,
  Bronze,
  Silver,
  Gold,
  Platinum,
}

export type Achievements = {
  challengeAccepted: AchievementLevel;
  committed: AchievementLevel;
  completionist: AchievementLevel;
  experimenterBean: AchievementLevel;
  experimenterFruit: AchievementLevel;
  experimenterGrain: AchievementLevel;
  experimenterLeafy: AchievementLevel;
  experimenterRoot: AchievementLevel;
  experimenterVegetable: AchievementLevel;
  favorite: AchievementLevel;
  hotStreak: AchievementLevel;
  thirtyVeggies: AchievementLevel;
};
