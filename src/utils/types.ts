import type {DateTime} from 'luxon';

export type Locale = 'en' | 'fi';

export enum Category {
  Fruit = 'fruit',
  Vegetable = 'vegetable',
  Leafy = 'leafy',
  Root = 'root',
  Bean = 'bean',
}

export type Action = {
  ingredient: string;
  date: DateTime;
};

export type Settings = {
  startDate: DateTime | null;
};

export type Ingredient = {
  key: string;
  category: Category;
};

export type TranslatedIngredient = Ingredient & {
  translation: string;
};
