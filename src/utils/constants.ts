import {Category, type Locale} from './types';

export const LOCALES: Locale[] = ['en', 'fi'];

export const DATE_FORMATS: Record<Locale, string> = {
  en: 'MM/dd/yyyy',
  fi: 'dd.MM.yyyy',
};

export const COLORS = {
  chartColors: ['#f0f9ff', '#bae6fd', '#38bdf8', '#0284c7', '#075985', '#082f49'],
  chartColorsAlternate: ['#fdc5f5', '#f7aef8', '#b388eb', '#8093f1', '#79b8f4', '#72ddf7'],
  darkGrey: '#0f172a',
  offWhite: '#f8fafc',
};

export const CATEGORY_EMOJI = {
  [Category.Fruit]: '🍎',
  [Category.Vegetable]: '🥦',
  [Category.Leafy]: '🥬',
  [Category.Root]: '🥕',
  [Category.Bean]: '🫛',
  [Category.Grain]: '🌾',
};

export const FRUITS = [
  'apple',
  'apricot',
  'banana',
  'bilberry',
  'blackberry',
  'blood grapefruit',
  'blueberry',
  'boysenberry',
  'cantaloupe',
  'cherry',
  'cloudberry',
  'coconut',
  'cranberry',
  'date',
  'dragon fruit',
  'durian',
  'fig',
  'gooseberry',
  'grape',
  'grapefruit',
  'guava',
  'honeydew melon',
  'jackfruit',
  'kiwi',
  'kumquat',
  'lemon',
  'lime',
  'lingonberry',
  'longan',
  'lychee',
  'mandarin',
  'mango',
  'mangosteen',
  'nectarine',
  'orange',
  'papaya',
  'passion fruit',
  'peach',
  'pear',
  'persimmon',
  'pineapple',
  'plum',
  'pomegranate',
  'pomelo',
  'quince',
  'rambutan',
  'raspberry',
  'starfruit',
  'strawberry',
  'tangerine',
  'watermelon',
];

export const LEAFIES = [
  'arugula',
  'basil',
  'bok choy',
  'cabbage',
  'chard',
  'cilantro',
  'collard greens',
  'dandelion greens',
  'endive',
  'frisée',
  'iceberg lettuce',
  'kale',
  'lettuce',
  'mache',
  'mizuna',
  'mustard greens',
  'napa cabbage',
  'oak leaf lettuce',
  'parsley',
  'radicchio',
  'red cabbage',
  'red leaf lettuce',
  'romaine',
  'sorrel',
  'spinach',
  'sprouts',
  'swiss chard',
  'watercress',
];

export const ROOTS = [
  'beet',
  'black radish',
  'black salsify',
  'burdock root',
  'carrot',
  'celeriac',
  'chives',
  'daikon',
  'fennel',
  'garlic',
  'ginger',
  'horseradish',
  'jerusalem artichoke',
  'jicama',
  'kohlrabi',
  'leek',
  'manioc',
  'onion',
  'parsnip',
  'potato',
  'radish',
  'red onion',
  'rutabaga',
  'scallion',
  'shallot',
  'sweet potato',
  'taro',
  'turnip',
  'wasabi',
  'white onion',
  'yam',
  'yellow beet',
];

export const VEGETABLES = [
  'artichoke',
  'asparagus',
  'avocado',
  'bell pepper',
  'bitter melon',
  'broccoli',
  'broccolini',
  'brussels sprouts',
  'cauliflower',
  'celery',
  'chayote',
  'cherry tomato',
  'chili pepper',
  'corn',
  'cucumber',
  'eggplant',
  'okra',
  'olive',
  'pumpkin',
  'rhubarb',
  'squash',
  'tomatillo',
  'tomato',
  'zucchini',
];

export const BEANS = [
  'adzuki bean',
  'black bean',
  'black-eyed pea',
  'broad bean',
  'brown lentil',
  'butter bean',
  'cannellini bean',
  'chickpea',
  'cranberry bean',
  'edamame',
  'fava bean',
  'flageolet bean',
  'green bean',
  'green lentil',
  'kidney bean',
  'lima bean',
  'mung bean',
  'pea',
  'pinto bean',
  'red bean',
  'red lentil',
  'soybean',
  'split pea',
  'white bean',
  'yardlong bean',
];

export const GRAINS = [
  'almond',
  'amaranth',
  'barley',
  'brazil nut',
  'buckwheat',
  'bulgur',
  'cashew nut',
  'chestnut',
  'chia seed',
  'couscous',
  'farro',
  'flaxseed',
  'hazelnut',
  'hemp seed',
  'kamut',
  'macadamia nut',
  'millet',
  'oat',
  'peanut',
  'pecan nut',
  'pine nut',
  'pistachio nut',
  'pumpkin seed',
  'quinoa',
  'rice',
  'rye',
  'safflower seed',
  'sesame seed',
  'sorghum',
  'spelt',
  'sunflower seed',
  'teff',
  'triticale',
  'walnut',
  'wheat',
  'wild rice',
];
