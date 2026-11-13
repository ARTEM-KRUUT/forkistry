// Единицы количества ингредиента и перевод в граммы для подсчёта калорий.
// Перевод приблизительный (ложка «с горкой» или без, размер яйца), но достаточный для оценки.

/** forms — склонение по числу; без forms подпись не меняется («ст. л.», «шт.»). */
export const UNITS = [
  { id: 'g', label: 'г' },
  { id: 'kg', label: 'кг' },
  { id: 'ml', label: 'мл' },
  { id: 'l', label: 'л' },
  { id: 'pcs', label: 'шт.' },
  { id: 'tbsp', label: 'ст. л.' },
  { id: 'tsp', label: 'ч. л.' },
  { id: 'cup', label: 'стакан', option: 'стакан (200 мл)', forms: ['стакан', 'стакана', 'стаканов'] },
  { id: 'clove', label: 'зубчик', forms: ['зубчик', 'зубчика', 'зубчиков'] },
  { id: 'pinch', label: 'щепотка', forms: ['щепотка', 'щепотки', 'щепоток'] },
  { id: 'taste', label: 'по вкусу' },
];

export const UNIT_BY_ID = Object.fromEntries(UNITS.map((u) => [u.id, u]));

// Объём единиц в миллилитрах (для жидкостей и продуктов без своего веса ложки)
const ML = { ml: 1, l: 1000, cup: 200, tbsp: 15, tsp: 5 };
const PINCH_G = 0.5;
const CLOVE_G = 5;

/**
 * Граммы для подсчёта калорий.
 * null — перевести нельзя (например, «шт.» у продукта, для которого неизвестен вес одной штуки).
 */
export function toGrams(product, qty, unit) {
  if (unit === 'taste') return 0;
  if (!Number.isFinite(qty) || qty <= 0) return null;
  const density = product?.density ?? 1;
  switch (unit) {
    case 'g':
      return qty;
    case 'kg':
      return qty * 1000;
    case 'pcs':
      return product?.piece ? qty * product.piece : null;
    case 'clove':
      return qty * (product?.clove ?? CLOVE_G);
    case 'pinch':
      return qty * PINCH_G;
    case 'tbsp':
    case 'tsp':
      return qty * (product?.[unit] ?? ML[unit] * density);
    case 'ml':
    case 'l':
    case 'cup':
      return qty * ML[unit] * density;
    default:
      return null;
  }
}

const formatQty = (q) => String(Math.round(q * 100) / 100).replace('.', ',');

function plural(n, [one, few, many]) {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return one;
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return few;
  return many;
}

/** Подпись единицы для количества: «1 стакан», «2 стакана», «1,5 стакана», «3 ст. л.». */
export function unitLabel(unit, qty) {
  const u = UNIT_BY_ID[unit];
  if (!u) return '';
  if (!u.forms) return u.label;
  return Number.isInteger(qty) ? plural(qty, u.forms) : u.forms[1];
}

/** «3 ст. л.», «1 шт.», «по вкусу». */
export function formatQtyUnit(qty, unit) {
  if (unit === 'taste') return 'по вкусу';
  return `${formatQty(qty)} ${unitLabel(unit, qty)}`;
}

/** Округление количества после пересчёта порций — своё для каждой единицы. */
export function roundForUnit(q, unit) {
  switch (unit) {
    case 'g':
    case 'ml':
      if (q < 20) return Math.max(1, Math.round(q));
      if (q < 200) return Math.round(q / 5) * 5;
      return Math.round(q / 10) * 10;
    case 'kg':
    case 'l':
      return Math.max(0.1, Math.round(q * 10) / 10);
    case 'cup':
      return Math.max(0.25, Math.round(q * 4) / 4);
    case 'pinch':
      return Math.max(1, Math.round(q));
    default:
      // шт., ложки, зубчики — до половинок
      return Math.max(0.5, Math.round(q * 2) / 2);
  }
}
