// Преобразования между рецептом и значениями формы редактора.
import { PRODUCTS } from '../data/products.js';
import { formatQtyUnit, toGrams } from '../data/units.js';
import { recipeNutrition } from './recipe.js';
import { isDefaultFit, normalizeFit } from './photoFit.js';

let seq = 0;
const key = () => `row-${Date.now().toString(36)}-${(seq += 1)}`;

const BY_NAME = new Map(PRODUCTS.map((p) => [p.name.toLowerCase(), p]));
/** Продукт справочника по названию (без учёта регистра). */
export const findProduct = (name = '') => BY_NAME.get(name.trim().toLowerCase());

/** «3», «1,5», «0.5» → число; пусто или не число → NaN. */
export const parseQty = (text = '') => (String(text).trim() ? Number(String(text).trim().replace(',', '.')) : NaN);

export const emptyIngredient = () => ({ key: key(), name: '', qty: '', unit: 'g', orig: null });
export const emptyStep = () => ({ key: key(), text: '', timerMinutes: '', photoUrl: '', photoFit: null });

/** Настройки кадра сохраняем, только если фото есть и кадр меняли. */
const fitFor = (url, fit) => (url.trim() && fit && !isDefaultFit(fit) ? normalizeFit(fit) : null);

export const EMPTY_FORM = {
  title: '',
  photoUrl: '',
  photoFit: null,
  category: '',
  timeMinutes: '',
  difficulty: 'easy',
  equipment: [],
  equipmentAny: [],
  portions: 'servings',
  servings: '2',
  yieldText: '',
  ingredients: [emptyIngredient()],
  steps: [emptyStep()],
};

// Подписи старых рецептов (текстом) → единица редактора
const LEGACY_UNITS = [
  [/^г\.?$|^гр\.?$/i, 'g'],
  [/^кг\.?$/i, 'kg'],
  [/^мл\.?$/i, 'ml'],
  [/^л\.?$/i, 'l'],
  [/^ст\.?\s*л\.?$|^столов/i, 'tbsp'],
  [/^ч\.?\s*л\.?$|^чайн/i, 'tsp'],
  [/^стакан/i, 'cup'],
  [/^зубч/i, 'clove'],
  [/^щепот/i, 'pinch'],
  [/^шт\.?$|^штук|^яйц|^яйцо|^луковиц|^веточ|^банан/i, 'pcs'],
];

/** Количество ингредиента → { qty, unit } для полей формы. */
export function ingredientToQty(ing) {
  if (ing.unit) return { qty: ing.unit === 'taste' ? '' : String(ing.qty ?? ''), unit: ing.unit };
  const text = (ing.amountText || '').trim();
  if (!text) return ing.grams ? { qty: String(ing.grams), unit: 'g' } : { qty: '', unit: 'taste' };
  if (/по вкусу|для подачи|для формы/i.test(text)) return { qty: '', unit: 'taste' };
  const m = text.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/);
  if (m) {
    const unit = LEGACY_UNITS.find(([re]) => re.test(m[2].trim()))?.[1];
    if (unit) return { qty: m[1].replace('.', ','), unit };
  }
  // Неизвестная подпись — показываем граммы, а если строку не тронут, сохранится как была
  return ing.grams ? { qty: String(ing.grams), unit: 'g' } : { qty: '', unit: 'taste' };
}

/** Рецепт → поля формы (для /recipe/:id/edit). */
export function recipeToForm(r) {
  return {
    title: r.title,
    photoUrl: r.photoUrl || '',
    photoFit: r.photoFit || null,
    category: r.category,
    timeMinutes: String(r.timeMinutes ?? ''),
    difficulty: r.difficulty,
    equipment: r.equipment ?? [],
    equipmentAny: r.equipmentAny ?? [],
    portions: r.servings ? 'servings' : 'yield',
    servings: r.servings ? String(r.servings) : '2',
    yieldText: r.yieldText || '',
    ingredients: r.ingredients.map((ing) => {
      const { qty, unit } = ingredientToQty(ing);
      // orig — исходный ингредиент и начальные значения полей: если строку не меняли, сохраняем как был
      return { key: key(), name: ing.name, qty, unit, orig: { ing, name: ing.name, qty, unit } };
    }),
    steps: r.steps.map((s) => ({
      key: key(),
      text: s.text,
      timerMinutes: s.timerSeconds ? String(Math.round((s.timerSeconds / 60) * 10) / 10) : '',
      photoUrl: s.photoUrl || '',
      photoFit: s.photoFit || null,
    })),
  };
}

/** Строка формы → ингредиент рецепта: количество в выбранной единице и граммы для калорий. */
export function rowToIngredient(row) {
  if (row.orig && row.name === row.orig.name && row.qty === row.orig.qty && row.unit === row.orig.unit) return row.orig.ing;
  const name = row.name.trim();
  const product = findProduct(name);
  const unit = row.unit;
  const qty = unit === 'taste' ? 0 : parseQty(row.qty);
  const grams = toGrams(product, qty, unit);
  return {
    productId: product?.id ?? null,
    name,
    qty,
    unit,
    grams: grams === null ? 0 : Math.round(grams * 10) / 10,
    amountText: formatQtyUnit(qty, unit),
    scalable: unit !== 'taste',
  };
}

/**
 * Обязательная техника и «на выбор». Одна техника «на выбор» — по сути обязательная:
 * переносим её в equipment, иначе фильтр по кухне понимал бы её неверно.
 */
export function splitEquipment(required = [], any = []) {
  const rest = any.filter((e) => !required.includes(e));
  if (rest.length === 1) return { equipment: [...required, rest[0]], equipmentAny: [] };
  return { equipment: required, equipmentAny: rest };
}

/** Поля формы → данные рецепта для API (калорийность считается здесь, на клиенте). */
export function formToRecipe(v) {
  const ingredients = v.ingredients.map(rowToIngredient);
  const servings = v.portions === 'servings' ? Number(v.servings) : null;
  const nutrition = recipeNutrition(ingredients, servings);
  return {
    title: v.title.trim(),
    photoUrl: v.photoUrl.trim(),
    photoFit: fitFor(v.photoUrl, v.photoFit),
    category: v.category,
    ...splitEquipment(v.equipment, v.equipmentAny),
    difficulty: v.difficulty,
    timeMinutes: Number(v.timeMinutes),
    servings,
    yieldText: servings ? '' : v.yieldText.trim(),
    ingredients,
    steps: v.steps.map((s) => {
      const step = {
        text: s.text.trim(),
        timerSeconds: s.timerMinutes === '' ? 0 : Math.round(Number(String(s.timerMinutes).replace(',', '.')) * 60),
        photoUrl: s.photoUrl.trim(),
      };
      const fit = fitFor(s.photoUrl, s.photoFit);
      return fit ? { ...step, photoFit: fit } : step;
    }),
    kcal: nutrition?.kcal ?? null,
    protein: nutrition?.protein ?? null,
    fat: nutrition?.fat ?? null,
    carbs: nutrition?.carbs ?? null,
  };
}
