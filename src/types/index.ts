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

export type CategoryFavorites = {
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

export type WeeklyChartData = {
  readonly weekStarts: Temporal.PlainDate[];
  readonly labels: string[];
  readonly weekStrings: string[];
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

export type WeeklyAchievements = {
  allOnRed: AchievementLevel;
  botanicalBerries: AchievementLevel;
  goNuts: AchievementLevel;
  lemons: AchievementLevel;
  overachiever: AchievementLevel;
  rainbow: AchievementLevel;
  tearnado: AchievementLevel;
  thirtyVeggies: AchievementLevel;
};

export type Achievements = WeeklyAchievements & {
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
  hotStreak: AchievementLevel;
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
  rarities: string[];
  staples: string[];
  veggies: string[];
  weekNumber: number;
};

export type SummaryItem = {
  emoji: string;
  translationKey: string;
  translationParameters: (string | number)[];
};
