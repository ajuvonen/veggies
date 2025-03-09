import type {InjectionKey, Ref} from 'vue';
import type {UseMemoizeReturn} from '@vueuse/core';
import {Category, type Locale} from './types';

export const APP_URL = 'https://eatyourveggies.app';

export const BLUESKY_URL = 'https://bsky.app/profile/eatyourveggies.app';

export const BUILD_TIME = __VITE_BUILD_TIME__;

export const KEYS = {
  challenge: Symbol() as InjectionKey<Ref<string | undefined>>,
  dropdownStyles: Symbol() as InjectionKey<
    UseMemoizeReturn<string, [active: boolean, selected: boolean]>
  >,
};

export const LOCALES: Locale[] = ['en', 'fi'] as const;

export const COLORS = {
  chartColors: ['#f0f9ff', '#bae6fd', '#38bdf8', '#0284c7', '#075985', '#082f49', '#0B1623'],
  chartColorsAlternate: [
    '#fdc5f5',
    '#f7aef8',
    '#b388eb',
    '#8093f1',
    '#79b8f4',
    '#72ddf7',
    '#bae6fd',
  ],
  offWhite: '#f8fafc',
  darkBlue: '#0c4a6e',
} as const;

export const CATEGORY_EMOJI = {
  [Category.Fruit]: '🍎',
  [Category.Vegetable]: '🥦',
  [Category.Leafy]: '🥬',
  [Category.Root]: '🥕',
  [Category.Bean]: '🫛',
  [Category.Grain]: '🌾',
  [Category.Mushroom]: '🍄‍🟫',
} as const;

export const FRUITS = [
  'apple',
  'apricot',
  'banana',
  'blackberry',
  'blackcurrant',
  'blood grapefruit',
  'blood orange',
  'blueberry',
  'boysenberry',
  'cantaloupe',
  'cape gooseberry',
  'caper',
  'cherimoya',
  'cherry',
  'clementine',
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
  'prickly pear',
  'quince',
  'rambutan',
  'raspberry',
  'redcurrant',
  'starfruit',
  'strawberry',
  'watermelon',
];

export const LEAFIES = [
  'arugula',
  'basil',
  'bok choy',
  'cabbage',
  'chard',
  'choy sum',
  'cilantro',
  'collard greens',
  'dandelion greens',
  'dill',
  'endive',
  'frisée',
  'holy basil',
  'iceberg lettuce',
  'kale',
  'lettuce',
  'mache',
  'mint',
  'mizuna',
  'mustard greens',
  'napa cabbage',
  'oak leaf lettuce',
  'parsley',
  'pea sprouts',
  'radicchio',
  'red cabbage',
  'red leaf lettuce',
  'romaine',
  'savoy cabbage',
  'sorrel',
  'spinach',
  'sprouts',
  'thyme',
  'water spinach',
  'watercress',
];

export const ROOTS = [
  'bamboo shoots',
  'beet',
  'black radish',
  'black salsify',
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
  'parsley root',
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
  'hokkaido pumpkin',
  'jalapeno',
  'musk gourd',
  'nori',
  'okra',
  'olive',
  'plantain',
  'pointed pepper',
  'pumpkin',
  'rhubarb',
  'spaghetti squash',
  'tomatillo',
  'tomato',
  'wakame',
  'zucchini',
];

export const MUSHROOMS = [
  'black trumpet mushroom',
  'champignon',
  'chanterelle',
  'enoki',
  'hedgehog mushroom',
  'king oyster mushroom',
  'matsutake',
  'morel',
  'oyster mushroom',
  'porcini',
  'portobello',
  'shiitake',
  'shimeji',
  'wild mushroom',
  'wood ear mushroom',
  'yellowfoot mushroom',
];

export const BEANS = [
  'black bean',
  'black lentil',
  'black-eyed pea',
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
  'mung bean',
  'pea',
  'pinto bean',
  'red bean',
  'red lentil',
  'scarlet runner bean',
  'snow pea',
  'soybean',
  'white bean',
  'yardlong bean',
  'yellow lentil',
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
  'poppy seed',
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

export const ALL_VEGGIES = [
  ...FRUITS,
  ...VEGETABLES,
  ...LEAFIES,
  ...ROOTS,
  ...BEANS,
  ...GRAINS,
  ...MUSHROOMS,
];
