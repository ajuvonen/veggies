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
  [key in Category]: readonly [string, number][];
};

export type Week = {
  veggies: string[];
  readonly startDate: DateTime;
};

export type Challenge = {
  readonly startDate: DateTime;
  veggie: string | undefined;
};

export type Settings = {
  allergens: string[];
  locale: Locale;
  showChartAnimations: boolean;
  suggestionCount: number;
  summaryViewedDate: DateTime | null;
};

export type Listing = {
  readonly veggie: string;
  readonly category: Category;
};

export type TranslatedListing = Listing & {
  readonly translation: string;
  readonly synonyms: string[];
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
  lemons: AchievementLevel;
  thirtyVeggies: AchievementLevel;
  thousandsOdd: AchievementLevel;
  thousandsEven: AchievementLevel;
};

export type WeekData = {
  atMostVeggies: number;
  challenge: string | undefined;
  firstTimeVeggies: string[];
  firstWeek: boolean;
  hotStreak: number;
  mean: number;
  previousWeekCount: number;
  veggies: string[];
  weekNumber: string;
};

export type SummaryItem = {
  emoji: string;
  translationKey: string;
  translationParameters: (string | number)[];
};
