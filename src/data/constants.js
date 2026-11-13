// Справочники значений полей рецепта (совпадают с select-полями в PocketBase).

export const CATEGORIES = [
  { id: 'Завтраки', color: 'var(--cat-breakfast)', image: '/seed/shakshuka.webp' },
  { id: 'Супы', color: 'var(--cat-soups)', image: '/seed/borsch.webp' },
  { id: 'Горячее', color: 'var(--cat-hot)', image: 'https://images.gastronom.ru/s1yltiWNPR1oqUqe1LFtp7dGrPVbBVUv4EzyVCadpDw/pr:recipe-cover-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzLzI4MzYzODY3LWYwMGMtNGNiYi04Yjc3LTUyNmRmN2JhM2YyNC5wbmc.webp' },
  { id: 'Паста', color: 'var(--cat-pasta)', image: '/seed/carbonara.webp' },
  { id: 'Салаты', color: 'var(--cat-salads)', image: 'https://img.povar.ru/mobile/ff/1e/13/de/salat_miks-782005.jpg' },
  { id: 'Выпечка', color: 'var(--cat-bakery)', image: 'https://static.1000.menu/img/content-v2/b5/ff/24589/bulochki-smetanniki_1749583333_2_e19ynma_max.jpg' },
  { id: 'Десерты', color: 'var(--cat-desserts)', image: 'https://www.torrefacto.ru/upload/medialibrary/444/mipnd2w7874cwr4z2k11som89l1jgpon.png' },
];

export const EQUIPMENT = ['Плита', 'Духовка', 'Аэрогриль', 'Блендер', 'Миксер', 'Мультиварка', 'Микроволновка'];

/** Популярный автор — сумма лайков по его рецептам не меньше порога. */
export const POPULAR_AUTHOR_MIN_LIKES = 3;

export const DIFFICULTY = {
  easy: { label: 'Легко', level: 1 },
  medium: { label: 'Средне', level: 2 },
  hard: { label: 'Сложно', level: 3 },
};

// Фильтры каталога (Figma 8:210)
export const TIME_OPTIONS = [
  { id: '30', label: 'До 30 мин', short: 'до 30 мин', test: (t) => t <= 30 },
  { id: '60', label: 'До 60 мин', short: 'до 60 мин', test: (t) => t <= 60 },
  { id: 'more', label: 'Больше часа', short: 'больше часа', test: (t) => t > 60 },
];

export const KCAL_OPTIONS = [
  { id: '300', label: 'До 300 ккал', short: 'до 300 ккал', max: 300 },
  { id: '500', label: 'До 500 ккал', short: 'до 500 ккал', max: 500 },
];

export const SORT_OPTIONS = [
  { id: 'popular', label: 'Сначала популярные' },
  { id: 'new', label: 'Сначала новые' },
  { id: 'fast', label: 'Сначала быстрые' },
];
