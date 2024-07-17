import {Category, type Locale} from './types';

export const DATE_FORMATS: Record<Locale, string> = {
  en: 'MM/dd/yyyy',
  fi: 'dd.MM.yyyy',
};

export const COLORS = {
  chartColors: ['#f0f9ff', '#bae6fd', '#38bdf8', '#0284c7', '#075985', '#082f49'],
  chartColorsAlternate: ['#fdc5f5', '#f7aef8', '#b388eb', '#8093f1', '#79b8f4', '#72ddf7'],
  darkGrey: '#0f172a',
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
  'blackberry',
  'blueberry',
  'cantaloupe',
  'cherry',
  'clementine',
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
  'longan',
  'lychee',
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
  'oakleaf lettuce',
  'parsley',
  'radicchio',
  'red cabbage',
  'red leaf lettuce',
  'romaine',
  'spinach',
  'sprouts',
  'swiss chard',
  'watercress',
];

export const ROOTS = [
  'beet',
  'black radish',
  'burdock root',
  'carrot',
  'celeriac',
  'chives',
  'daikon',
  'fennel',
  'garlic',
  'ginger',
  'horseradish',
  'jicama',
  'kohlrabi',
  'leek',
  'onion',
  'parsnip',
  'potato',
  'radish',
  'red onion',
  'rutabaga',
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
  'cabbage',
  'cauliflower',
  'celery',
  'chayote',
  'chili pepper',
  'corn',
  'cucumber',
  'eggplant',
  'okra',
  'olive',
  'pumpkin',
  'rhubarb',
  'squash',
  'tomato',
  'zucchini',
];

export const BEANS = [
  'adzuki bean',
  'black bean',
  'black-eyed pea',
  'broad bean',
  'butter bean',
  'cannellini bean',
  'chickpea',
  'cranberry bean',
  'edamame',
  'fava bean',
  'flageolet bean',
  'garbanzo bean',
  'green bean',
  'kidney bean',
  'lentil',
  'lima bean',
  'mung bean',
  'pea',
  'pinto bean',
  'red bean',
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
  'wild rice',
  'wheat',
];
