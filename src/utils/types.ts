import type {DateTime} from 'luxon';

export type Locale = 'en' | 'fi';

export enum Category {
  Fruit = 'Fruit',
  Vegetable = 'Vegetable',
  Leafy = 'Leafy',
  Root = 'Root',
  Bean = 'Bean',
  Grain = 'Grain',
}

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
}

export type Achievements = {
  challengeAccepted: AchievementLevel;
  committed: AchievementLevel;
  completionist: AchievementLevel;
  hotStreak: AchievementLevel;
  experimenterBean: AchievementLevel;
  experimenterFruit: AchievementLevel;
  experimenterGrain: AchievementLevel;
  experimenterLeafy: AchievementLevel;
  experimenterRoot: AchievementLevel;
  experimenterVegetable: AchievementLevel;
  thirtyVeggies: AchievementLevel;
};
