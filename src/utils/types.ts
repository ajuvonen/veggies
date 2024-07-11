import type {DateTime} from 'luxon';

export type Locale = 'en' | 'fi';

export enum Category {
  Fruit = 'fruit',
  Vegetable = 'vegetable',
  Leafy = 'leafy',
  Root = 'root',
  Bean = 'bean',
  Grain = 'grain',
}

export type Activity = {
  veggie: string;
  date: DateTime;
};

export type Settings = {
  locale: Locale;
  startDate: DateTime | null;
};

export type Listing = {
  veggie: string;
  category: Category;
};

export type TranslatedListing = Listing & {
  translation: string;
};
