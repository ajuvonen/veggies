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
  readonly startDate: Temporal.PlainDate;
  readonly challenge: string;
};

export type Settings = {
  AIAllowed: boolean | null;
  allergens: string[];
  locale: Locale;
  migrationVersion: number;
  showChartAnimations: boolean;
  showVeggieFacts: boolean;
  startDate: Temporal.PlainDate | null;
  suggestionCount: number;
  summaryViewedDate: Temporal.PlainDate | null;
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
  overachiever: AchievementLevel;
  rainbow: AchievementLevel;
  tearnado: AchievementLevel;
  thirtyVeggies: AchievementLevel;
  thousandsOdd: AchievementLevel;
  thousandsEven: AchievementLevel;
};

export type WeekData = {
  atMostVeggies: number;
  categoryCounts: Partial<Record<Category, number>>;
  challenge: string | null;
  favoriteCategory: Category | null;
  firstTimeVeggies: string[];
  firstWeek: boolean;
  hotStreak: number;
  mean: number;
  missingCategories: Category[];
  previousWeekCount: number;
  veggies: string[];
  weekNumber: number;
};

export type SummaryItem = {
  emoji: string;
  translationKey: string;
  translationParameters: (string | number)[];
};
