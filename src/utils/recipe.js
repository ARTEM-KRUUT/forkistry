import { getProduct } from '../data/products.js';
import { formatQtyUnit, roundForUnit } from '../data/units.js';
import { plural } from './format.js';

/**
 * Ингредиент: { productId, name, qty, unit, grams, amountText, scalable }.
 * – qty + unit — количество в удобной единице («3» + «tbsp» → «3 ст. л.»), см. data/units.js;
 * – grams — то же количество в граммах для расчёта калорий (переводится при сохранении);
 * – amountText — готовая подпись; у старых рецептов без unit это единственный источник («3 зубчика»);
 * – scalable = false — не пересчитывается при смене порций («по вкусу»).
 */

/**
 * Пищевая ценность рецепта: калории и БЖУ (белки, жиры, углеводы, г) — всего, на порцию и на 100 г.
 * null, если хотя бы у одного ингредиента с весом нет продукта в справочнике.
 */
export function calcNutrition(ingredients = [], servings) {
  const sum = { kcal: 0, protein: 0, fat: 0, carbs: 0 };
  let weight = 0;

  for (const ing of ingredients) {
    if (ing.unit === 'taste') continue; // «по вкусу» в расчёте не участвует
    if (!ing.grams) {
      // Количество есть, но в граммы не перевелось (например, «шт.» без известного веса штуки)
      if (ing.unit) return null;
      continue; // старые рецепты: «для подачи» и т. п. без веса
    }
    const product = getProduct(ing.productId);
    if (!product) return null;
    const k = ing.grams / 100;
    sum.kcal += product.kcal * k;
    sum.protein += (product.p ?? 0) * k;
    sum.fat += (product.f ?? 0) * k;
    sum.carbs += (product.c ?? 0) * k;
    weight += ing.grams;
  }

  if (weight === 0) return null;
  // Калории — целыми, граммы БЖУ — с одним знаком
  const round = (v) => ({ kcal: Math.round(v.kcal), protein: r1(v.protein), fat: r1(v.fat), carbs: r1(v.carbs) });
  const scale = (d) => ({ kcal: sum.kcal / d, protein: sum.protein / d, fat: sum.fat / d, carbs: sum.carbs / d });
  return {
    total: round(sum),
    perServing: servings ? round(scale(servings)) : null,
    per100g: round(scale(weight / 100)),
  };
}

const r1 = (v) => Math.round(v * 10) / 10;

/** Калорийность: всего, на порцию и на 100 г (числа ккал). */
export function calcCalories(ingredients = [], servings) {
  const n = calcNutrition(ingredients, servings);
  if (!n) return null;
  return { total: n.total.kcal, perServing: n.perServing?.kcal ?? null, per100g: n.per100g.kcal };
}

/**
 * Пищевая ценность для полей рецепта (kcal, protein, fat, carbs): на порцию,
 * а у рецептов без порций — на 100 г. null — посчитать нельзя.
 */
export function recipeNutrition(ingredients, servings) {
  const n = calcNutrition(ingredients, servings);
  if (!n) return null;
  return servings ? n.perServing : n.per100g;
}

/** Значение поля `kcal` рецепта: на порцию, а у рецептов без порций — на 100 г. */
export function recipeKcal(ingredients, servings) {
  return recipeNutrition(ingredients, servings)?.kcal ?? null;
}

/** Округление веса «по-кухонному»: до 1 г, 5 г или 10 г в зависимости от величины. */
function roundGrams(g) {
  if (g < 20) return Math.max(1, Math.round(g));
  if (g < 200) return Math.round(g / 5) * 5;
  return Math.round(g / 10) * 10;
}

/** Округление штучного количества до половинок: 1,5 зубчика, 2 яйца. */
function roundQty(q) {
  const r = Math.round(q * 2) / 2;
  return r < 0.5 ? 0.5 : r;
}

// Единицы, которые склоняются по числу; сокращения («ст. л.», «г», «шт.») не меняются.
const UNIT_FORMS = [
  ['зубчик', 'зубчика', 'зубчиков'],
  ['веточка', 'веточки', 'веточек'],
  ['щепотка', 'щепотки', 'щепоток'],
  ['пучок', 'пучка', 'пучков'],
  ['штука', 'штуки', 'штук'],
  ['яйцо', 'яйца', 'яиц'],
  ['стакан', 'стакана', 'стаканов'],
  ['луковица', 'луковицы', 'луковиц'],
];

function inflectUnit(unit, qty) {
  const forms = UNIT_FORMS.find((f) => f.includes(unit));
  if (!forms) return unit;
  // Дробное количество в русском согласуется с родительным падежом ед. ч.: «1,5 зубчика»
  return Number.isInteger(qty) ? plural(qty, forms) : forms[1];
}

const formatQty = (q) => String(q).replace('.', ',');

/** Текст количества с учётом коэффициента порций. */
export function formatAmount(ing, factor = 1) {
  const k = ing.scalable === false ? 1 : factor;

  if (ing.unit) {
    if (ing.unit === 'taste') return 'по вкусу';
    const qty = k === 1 ? ing.qty : roundForUnit(ing.qty * k, ing.unit);
    return formatQtyUnit(qty, ing.unit);
  }

  if (ing.amountText) {
    const match = ing.amountText.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/);
    if (!match || k === 1) return ing.amountText;
    const qty = roundQty(parseFloat(match[1].replace(',', '.')) * k);
    return `${formatQty(qty)} ${inflectUnit(match[2], qty)}`.trim();
  }

  if (ing.grams) return `${roundGrams(ing.grams * k)} г`;
  return '';
}

/** Ингредиент без количества или помеченный как «по вкусу». */
export function isToTaste(ing) {
  if (ing.unit) return ing.unit === 'taste';
  return !ing.grams && (!ing.amountText || /по вкусу/i.test(ing.amountText));
}
