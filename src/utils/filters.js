import { DIFFICULTY, EQUIPMENT, KCAL_OPTIONS, TIME_OPTIONS } from '../data/constants.js';
import { quote } from '../api/client.js';

export const DEFAULT_FILTERS = {
  search: '',
  category: null,
  equipment: [], // техника, которая есть дома
  time: null, // id из TIME_OPTIONS
  difficulty: [], // easy | medium | hard
  kcal: null, // id из KCAL_OPTIONS, null — любая
  sort: 'popular',
};

const TIME_FILTER = { 30: 'timeMinutes <= 30', 60: 'timeMinutes <= 60', more: 'timeMinutes > 60' };

/** Варианты регистра для поиска: оператор ~ в SQLite не сравнивает кириллицу без учёта регистра. */
function caseVariants(text) {
  const lower = text.toLowerCase();
  const cap = lower.charAt(0).toUpperCase() + lower.slice(1);
  return [...new Set([text, lower, cap])];
}

/**
 * Строка filter для PocketBase по фильтрам каталога.
 * Техника («покажем только то, что получится приготовить»), рецепт подходит, если:
 * – вся обязательная техника (equipment) есть среди выбранной;
 * – из техники «на выбор» (equipmentAny) есть хотя бы одна — или такой техники у рецепта нет.
 * Для equipmentAny нужен оператор ~: ?= на списке выбора в PocketBase 0.40 не срабатывает (проверено).
 */
export function buildRecipeFilter(f = {}) {
  const parts = [];
  const search = f.search?.trim();
  if (search) {
    const variants = caseVariants(search);
    parts.push(`(${variants.flatMap((v) => [`title ~ ${quote(v)}`, `ingredients ~ ${quote(v)}`]).join(' || ')})`);
  }
  if (f.category) parts.push(`category = ${quote(f.category)}`);
  if (f.equipment?.length) {
    for (const e of EQUIPMENT.filter((item) => !f.equipment.includes(item))) parts.push(`equipment !~ ${quote(e)}`);
    parts.push(`(equipmentAny:length = 0 || ${f.equipment.map((e) => `equipmentAny ~ ${quote(e)}`).join(' || ')})`);
  }
  if (f.time && TIME_FILTER[f.time]) parts.push(TIME_FILTER[f.time]);
  if (f.difficulty?.length) parts.push(`(${f.difficulty.map((d) => `difficulty = ${quote(d)}`).join(' || ')})`);
  if (f.kcal) {
    const opt = KCAL_OPTIONS.find((o) => o.id === f.kcal);
    if (opt) parts.push(`kcal > 0 && kcal <= ${opt.max}`);
  }
  if (f.author) parts.push(`author = ${quote(f.author)}`);
  return parts.join(' && ');
}

/** Параметр sort для PocketBase. */
export function sortParam(sort = 'popular') {
  if (sort === 'new') return '-created';
  if (sort === 'fast') return 'timeMinutes,-likes';
  return '-likes,-favoritesCount';
}

/** Число на кнопке фильтров: выбранные значения в панели (без категории и поиска). */
export function countActiveFilters(f) {
  return f.equipment.length + f.difficulty.length + (f.time ? 1 : 0) + (f.kcal ? 1 : 0);
}

/** Строка «Духовка, плита · до 60 мин» над списком. */
export function describeFilters(f) {
  const parts = [];
  if (f.equipment.length) parts.push(f.equipment.map((e) => e.toLowerCase()).join(', '));
  if (f.time) parts.push(TIME_OPTIONS.find((o) => o.id === f.time)?.short);
  if (f.difficulty.length) parts.push(f.difficulty.map((d) => DIFFICULTY[d].label.toLowerCase()).join(', '));
  if (f.kcal) parts.push(KCAL_OPTIONS.find((o) => o.id === f.kcal)?.short);
  const text = parts.filter(Boolean).join(' · ');
  return text ? text[0].toUpperCase() + text.slice(1) : '';
}

/** Добавить или убрать значение из массива (мультивыбор чипов). */
export function toggleValue(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}
