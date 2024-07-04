import type {DateTime} from 'luxon';

export type Action = {
  ingredient: string;
  date: DateTime;
};

export type Settings = {
  startDate: DateTime | null;
};
