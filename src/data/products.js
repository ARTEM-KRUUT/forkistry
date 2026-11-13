// Справочник продуктов: калорийность и БЖУ на 100 г — kcal, p (белки), f (жиры), c (углеводы), г;
// усреднённые табличные значения
// и данные для перевода в граммы (src/data/units.js):
// – unit — единица по умолчанию в редакторе;
// – piece — вес одной штуки, г (яйцо С1 — 55 г, средняя луковица — 80 г и т. п.);
// – tbsp / tsp — вес столовой / чайной ложки, г (для сыпучих и густых — по кулинарным таблицам);
// – density — плотность, г/мл (для жидкостей: мл, л, стакан и ложки без своего веса).

export const PRODUCTS = [
  // Мясо, птица, рыба
  { id: 'chicken-thigh', name: 'Куриные бёдра', kcal: 185, p: 17.3, f: 12.8, c: 0, unit: 'g', piece: 150 },
  { id: 'chicken-breast', name: 'Куриное филе', kcal: 113, p: 23.6, f: 1.9, c: 0.4, unit: 'g', piece: 200 },
  { id: 'beef', name: 'Говядина', kcal: 187, p: 18.9, f: 12.4, c: 0, unit: 'g' },
  { id: 'pork', name: 'Свинина', kcal: 259, p: 16, f: 21.6, c: 0, unit: 'g' },
  { id: 'minced-meat', name: 'Фарш говяжий', kcal: 254, p: 17.2, f: 20, c: 0, unit: 'g' },
  { id: 'bacon', name: 'Бекон', kcal: 500, p: 23, f: 45, c: 0, unit: 'g', piece: 15 },
  { id: 'salmon', name: 'Лосось', kcal: 208, p: 20, f: 13, c: 0, unit: 'g', piece: 150 },

  // Яйца: категории по весу — С0 (65–75 г), С1 (55–65 г), С2 (45–55 г), СВ (от 75 г)
  { id: 'egg', name: 'Яйцо куриное', kcal: 157, p: 12.7, f: 10.9, c: 0.7, unit: 'pcs', piece: 55 },
  { id: 'egg-c0', name: 'Яйцо куриное С0', kcal: 157, p: 12.7, f: 10.9, c: 0.7, unit: 'pcs', piece: 65 },
  { id: 'egg-c1', name: 'Яйцо куриное С1', kcal: 157, p: 12.7, f: 10.9, c: 0.7, unit: 'pcs', piece: 55 },
  { id: 'egg-c2', name: 'Яйцо куриное С2', kcal: 157, p: 12.7, f: 10.9, c: 0.7, unit: 'pcs', piece: 45 },
  { id: 'egg-cb', name: 'Яйцо куриное СВ', kcal: 157, p: 12.7, f: 10.9, c: 0.7, unit: 'pcs', piece: 75 },
  { id: 'quail-egg', name: 'Яйцо перепелиное', kcal: 168, p: 11.9, f: 13.1, c: 0.6, unit: 'pcs', piece: 12 },
  { id: 'egg-yolk', name: 'Желток куриный', kcal: 352, p: 16.2, f: 31.2, c: 1, unit: 'pcs', piece: 17 },

  // Молочное
  { id: 'milk', name: 'Молоко 2,5%', kcal: 52, p: 2.8, f: 2.5, c: 4.7, unit: 'ml', density: 1.03, tbsp: 18, tsp: 5 },
  { id: 'kefir', name: 'Кефир 2,5%', kcal: 51, p: 2.9, f: 2.5, c: 4, unit: 'ml', density: 1.03, tbsp: 18, tsp: 5 },
  { id: 'cream', name: 'Сливки 20%', kcal: 205, p: 2.8, f: 20, c: 3.7, unit: 'ml', density: 1.01, tbsp: 18, tsp: 5 },
  { id: 'cream-33', name: 'Сливки 33%', kcal: 322, p: 2.2, f: 33, c: 3, unit: 'ml', density: 1.0, tbsp: 18, tsp: 5 },
  { id: 'sour-cream', name: 'Сметана 15%', kcal: 162, p: 2.6, f: 15, c: 3.6, unit: 'g', density: 1.05, tbsp: 25, tsp: 10 },
  { id: 'cottage-cheese', name: 'Творог 5%', kcal: 121, p: 17.2, f: 5, c: 1.8, unit: 'g', tbsp: 17, tsp: 5 },
  { id: 'butter', name: 'Сливочное масло', kcal: 748, p: 0.5, f: 82.5, c: 0.8, unit: 'g', tbsp: 20, tsp: 5 },
  { id: 'parmesan', name: 'Пармезан', kcal: 392, p: 35.8, f: 25.8, c: 3.2, unit: 'g', tbsp: 10, tsp: 3 },
  { id: 'feta', name: 'Фета', kcal: 264, p: 14.2, f: 21.3, c: 4.1, unit: 'g' },
  { id: 'mozzarella', name: 'Моцарелла', kcal: 280, p: 22, f: 21, c: 2, unit: 'g', piece: 125 },
  { id: 'yogurt', name: 'Йогурт натуральный', kcal: 66, p: 5, f: 3.2, c: 3.5, unit: 'g', density: 1.05, tbsp: 25, tsp: 8 },

  // Овощи и зелень
  { id: 'potato', name: 'Картофель', kcal: 77, p: 2, f: 0.4, c: 16.3, unit: 'g', piece: 100 },
  { id: 'carrot', name: 'Морковь', kcal: 35, p: 1.3, f: 0.1, c: 6.9, unit: 'g', piece: 80 },
  { id: 'onion', name: 'Лук репчатый', kcal: 41, p: 1.4, f: 0, c: 8.2, unit: 'g', piece: 80 },
  { id: 'garlic', name: 'Чеснок', kcal: 149, p: 6.5, f: 0.5, c: 29.9, unit: 'clove', piece: 50, clove: 5 },
  { id: 'beet', name: 'Свёкла', kcal: 43, p: 1.5, f: 0.1, c: 8.8, unit: 'g', piece: 250 },
  { id: 'cabbage', name: 'Капуста белокочанная', kcal: 27, p: 1.8, f: 0.1, c: 4.7, unit: 'g' },
  { id: 'tomato', name: 'Помидоры', kcal: 20, p: 0.6, f: 0.2, c: 4.2, unit: 'g', piece: 120 },
  { id: 'canned-tomato', name: 'Томаты в собственном соку', kcal: 24, p: 1.1, f: 0.1, c: 3.8, unit: 'g' },
  { id: 'tomato-paste', name: 'Томатная паста', kcal: 82, p: 4.8, f: 0, c: 16.7, unit: 'tbsp', tbsp: 30, tsp: 10 },
  { id: 'cucumber', name: 'Огурцы', kcal: 15, p: 0.8, f: 0.1, c: 2.8, unit: 'g', piece: 120 },
  { id: 'bell-pepper', name: 'Перец болгарский', kcal: 26, p: 1.3, f: 0, c: 5.3, unit: 'g', piece: 150 },
  { id: 'zucchini', name: 'Кабачок', kcal: 24, p: 0.6, f: 0.3, c: 4.6, unit: 'g', piece: 300 },
  { id: 'lettuce', name: 'Салат листовой', kcal: 15, p: 1.4, f: 0.2, c: 2.3, unit: 'g' },
  { id: 'greens', name: 'Зелень (укроп, петрушка)', kcal: 40, p: 3, f: 0.4, c: 6.5, unit: 'g', tbsp: 4, tsp: 1 },
  { id: 'rosemary', name: 'Розмарин', kcal: 131, p: 3.3, f: 5.9, c: 20.7, unit: 'pcs', piece: 2 },
  { id: 'basil', name: 'Базилик', kcal: 23, p: 3.2, f: 0.6, c: 2.7, unit: 'g', piece: 1 },
  { id: 'bay-leaf', name: 'Лавровый лист', kcal: 313, p: 7.6, f: 8.4, c: 48.7, unit: 'pcs', piece: 0.2 },
  { id: 'olives', name: 'Оливки', kcal: 166, p: 1.8, f: 16.7, c: 5.2, unit: 'g', piece: 4, tbsp: 15 },

  // Фрукты и ягоды
  { id: 'apple', name: 'Яблоки', kcal: 47, p: 0.4, f: 0.4, c: 9.8, unit: 'g', piece: 180 },
  { id: 'banana', name: 'Бананы', kcal: 96, p: 1.5, f: 0.2, c: 21.8, unit: 'pcs', piece: 120 },
  { id: 'berries', name: 'Ягоды замороженные', kcal: 45, p: 0.8, f: 0.4, c: 9, unit: 'g', tbsp: 15 },
  { id: 'lemon', name: 'Лимон', kcal: 34, p: 0.9, f: 0.1, c: 3, unit: 'pcs', piece: 100 },
  { id: 'lemon-juice', name: 'Сок лимона', kcal: 22, p: 0.4, f: 0.2, c: 6.9, unit: 'tbsp', density: 1.03, tbsp: 15, tsp: 5 },

  // Крупы, мука, макароны
  { id: 'flour', name: 'Мука пшеничная', kcal: 334, p: 10.3, f: 1.1, c: 69.9, unit: 'g', density: 0.53, tbsp: 25, tsp: 8 },
  { id: 'spaghetti', name: 'Спагетти', kcal: 344, p: 10.4, f: 1.1, c: 71.5, unit: 'g' },
  { id: 'noodles', name: 'Яичная лапша', kcal: 348, p: 13, f: 3, c: 66, unit: 'g' },
  { id: 'rice', name: 'Рис', kcal: 344, p: 6.7, f: 0.7, c: 78.9, unit: 'g', density: 0.8, tbsp: 25, tsp: 8 },
  { id: 'buckwheat', name: 'Гречка', kcal: 313, p: 12.6, f: 3.3, c: 62.1, unit: 'g', density: 0.8, tbsp: 25, tsp: 7 },
  { id: 'oats', name: 'Овсяные хлопья', kcal: 352, p: 12.3, f: 6.1, c: 59.5, unit: 'g', density: 0.45, tbsp: 12, tsp: 4 },
  { id: 'semolina', name: 'Манка', kcal: 333, p: 10.3, f: 1, c: 70.6, unit: 'g', density: 0.75, tbsp: 25, tsp: 8 },
  { id: 'bread', name: 'Хлеб белый', kcal: 265, p: 7.6, f: 3.3, c: 51, unit: 'g', piece: 30 },

  // Бакалея
  { id: 'sugar', name: 'Сахар', kcal: 398, p: 0, f: 0, c: 99.7, unit: 'g', density: 0.85, tbsp: 25, tsp: 8 },
  { id: 'vanilla-sugar', name: 'Ванильный сахар', kcal: 398, p: 0, f: 0, c: 99.7, unit: 'tsp', tbsp: 25, tsp: 8 },
  { id: 'gelatin', name: 'Желатин', kcal: 355, p: 87.2, f: 0.4, c: 0.7, unit: 'g', tbsp: 15, tsp: 5 },
  { id: 'chia', name: 'Семена чиа', kcal: 486, p: 16.5, f: 30.7, c: 42.1, unit: 'tsp', tbsp: 12, tsp: 4 },
  { id: 'vinegar', name: 'Уксус 9%', kcal: 11, p: 0, f: 0, c: 3, unit: 'tbsp', density: 1.0, tbsp: 15, tsp: 5 },
  { id: 'paprika', name: 'Паприка сладкая', kcal: 282, p: 14, f: 13, c: 54, unit: 'tsp', tbsp: 8, tsp: 3 },
  { id: 'cumin', name: 'Зира', kcal: 375, p: 17.8, f: 22.3, c: 44.2, unit: 'tsp', tbsp: 6, tsp: 2 },
  { id: 'oregano', name: 'Орегано сушёный', kcal: 265, p: 9, f: 4.3, c: 68.9, unit: 'tsp', tbsp: 3, tsp: 1 },
  { id: 'honey', name: 'Мёд', kcal: 329, p: 0.8, f: 0, c: 81.5, unit: 'tsp', density: 1.4, tbsp: 30, tsp: 12 },
  { id: 'olive-oil', name: 'Оливковое масло', kcal: 898, p: 0, f: 99.8, c: 0, unit: 'tbsp', density: 0.92, tbsp: 17, tsp: 5 },
  { id: 'sunflower-oil', name: 'Подсолнечное масло', kcal: 899, p: 0, f: 99.9, c: 0, unit: 'tbsp', density: 0.92, tbsp: 17, tsp: 5 },
  { id: 'baking-powder', name: 'Разрыхлитель', kcal: 79, p: 0, f: 0, c: 37.8, unit: 'tsp', tbsp: 15, tsp: 5 },
  { id: 'cinnamon', name: 'Корица', kcal: 247, p: 3.9, f: 1.2, c: 80.6, unit: 'tsp', tbsp: 8, tsp: 3 },
  { id: 'cocoa', name: 'Какао-порошок', kcal: 289, p: 24.3, f: 15, c: 10.2, unit: 'tbsp', tbsp: 10, tsp: 4 },
  { id: 'salt', name: 'Соль', kcal: 0, p: 0, f: 0, c: 0, unit: 'tsp', tbsp: 30, tsp: 10 },
  { id: 'black-pepper', name: 'Перец чёрный молотый', kcal: 251, p: 10.4, f: 3.3, c: 64, unit: 'pinch', tbsp: 6, tsp: 2 },
  { id: 'water', name: 'Вода', kcal: 0, p: 0, f: 0, c: 0, unit: 'ml' },
];

const BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));

export function getProduct(id) {
  return id ? BY_ID.get(id) : undefined;
}
