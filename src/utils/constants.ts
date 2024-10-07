import type {InjectionKey, Ref} from 'vue';
import {Category, type Locale} from './types';

export const KEYS = {
  challenge: Symbol() as InjectionKey<Ref<string | undefined>>,
  dropdownOptions: Symbol() as InjectionKey<(active: boolean, selected: boolean) => string>,
};

export const LOCALES: Locale[] = ['en', 'fi'];

export const COLORS = {
  chartColors: ['#f0f9ff', '#bae6fd', '#38bdf8', '#0284c7', '#075985', '#082f49'],
  chartColorsAlternate: ['#fdc5f5', '#f7aef8', '#b388eb', '#8093f1', '#79b8f4', '#72ddf7'],
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
  'blackberry',
  'blood grapefruit',
  'blood orange',
  'blueberry',
  'boysenberry',
  'cantaloupe',
  'caper',
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
  'cilantro',
  'collard greens',
  'dandelion greens',
  'dill',
  'endive',
  'frisée',
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
  'radicchio',
  'red cabbage',
  'red leaf lettuce',
  'romaine',
  'sorrel',
  'spinach',
  'sprouts',
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
  'black trumpet mushroom',
  'broccoli',
  'broccolini',
  'brussels sprouts',
  'cauliflower',
  'celery',
  'champignon',
  'chanterelle',
  'chayote',
  'cherry tomato',
  'chili pepper',
  'corn',
  'cucumber',
  'eggplant',
  'hedgehog mushroom',
  'matsutake',
  'musk gourd',
  'nori',
  'okra',
  'olive',
  'porcini',
  'portobello',
  'pumpkin',
  'rhubarb',
  'shiitake',
  'tomatillo',
  'tomato',
  'wakame',
  'yellowfoot mushroom',
  'zucchini',
];

export const BEANS = [
  'black bean',
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

export const ALL_VEGGIES = [...FRUITS, ...VEGETABLES, ...LEAFIES, ...ROOTS, ...BEANS, ...GRAINS];
