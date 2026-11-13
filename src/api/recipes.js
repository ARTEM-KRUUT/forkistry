// Рецепты и авторы через PocketBase REST API.
import { request, quote } from './client.js';
import { buildRecipeFilter, sortParam } from '../utils/filters.js';
import { POPULAR_AUTHOR_MIN_LIKES } from '../data/constants.js';

const BASE = '/collections/recipes/records';
const AUTHOR_FIELDS = 'expand.author.id,expand.author.name,expand.author.avatarUrl';
// Для карточек не тянем тяжёлые ingredients/steps
const CARD_FIELDS = `id,title,photoUrl,photoFit,category,equipment,equipmentAny,difficulty,timeMinutes,servings,kcal,protein,fat,carbs,likes,dislikes,favoritesCount,created,author,${AUTHOR_FIELDS}`;

/** Запись PocketBase → объект рецепта для интерфейса. 0 в числовых полях = «не задано». */
export function normalizeRecipe(r) {
  const a = r.expand?.author;
  return {
    id: r.id,
    title: r.title,
    photoUrl: r.photoUrl || '',
    photoFit: r.photoFit || null,
    category: r.category,
    equipment: r.equipment ?? [],
    equipmentAny: r.equipmentAny ?? [],
    difficulty: r.difficulty,
    timeMinutes: r.timeMinutes,
    servings: r.servings || null,
    yieldText: r.yieldText || '',
    ingredients: r.ingredients ?? [],
    steps: r.steps ?? [],
    kcal: r.kcal || null,
    // БЖУ известны, только если посчитаны калории (у старых записей полей может не быть)
    // Рецепты, сохранённые до появления полей БЖУ, получили нули — считаем их неизвестными
    macros: r.kcal && (r.protein || r.fat || r.carbs) ? { protein: r.protein || 0, fat: r.fat || 0, carbs: r.carbs || 0 } : null,
    likes: r.likes ?? 0,
    dislikes: r.dislikes ?? 0,
    favoritesCount: r.favoritesCount ?? 0,
    created: r.created,
    author: a ? { id: a.id, name: a.name, avatarUrl: a.avatarUrl || '' } : r.author ? { id: r.author, name: '' } : null,
  };
}

/**
 * Список рецептов по фильтрам каталога.
 * @returns {Promise<{ items: object[], total: number }>}
 */
export async function getRecipes(filters = {}, { limit = 100, page = 1 } = {}) {
  const res = await request(BASE, {
    query: {
      filter: buildRecipeFilter(filters),
      sort: sortParam(filters.sort),
      perPage: limit,
      page,
      expand: 'author',
      fields: CARD_FIELDS,
    },
  });
  return { items: res.items.map(normalizeRecipe), total: res.totalItems };
}

/** Только количество — для кнопки «Показать N рецептов». */
export async function countRecipes(filters = {}) {
  const res = await request(BASE, { query: { filter: buildRecipeFilter(filters), perPage: 1, fields: 'id' } });
  return res.totalItems;
}

export async function getRecipe(id) {
  return normalizeRecipe(await request(`${BASE}/${encodeURIComponent(id)}`, { query: { expand: 'author' } }));
}

/** Данные формы редактора → тело запроса (author только при создании). */
function toBody(data) {
  return {
    title: data.title,
    photoUrl: data.photoUrl,
    photoFit: data.photoFit ?? null,
    category: data.category,
    equipment: data.equipment,
    equipmentAny: data.equipmentAny ?? [],
    difficulty: data.difficulty,
    timeMinutes: data.timeMinutes,
    servings: data.servings ?? 0,
    yieldText: data.servings ? '' : data.yieldText,
    ingredients: data.ingredients,
    steps: data.steps,
    kcal: data.kcal ?? 0,
    protein: data.protein ?? 0,
    fat: data.fat ?? 0,
    carbs: data.carbs ?? 0,
  };
}

export async function createRecipe(data, authorId) {
  const rec = await request(BASE, { method: 'POST', body: { ...toBody(data), author: authorId }, query: { expand: 'author' } });
  return normalizeRecipe(rec);
}

export async function updateRecipe(id, data) {
  const rec = await request(`${BASE}/${encodeURIComponent(id)}`, { method: 'PATCH', body: toBody(data), query: { expand: 'author' } });
  return normalizeRecipe(rec);
}

export function deleteRecipe(id) {
  return request(`${BASE}/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

// ── Авторы ──────────────────────────────────────────────────────────────

export async function getAuthor(id) {
  const [user, own] = await Promise.all([
    request(`/collections/users/records/${encodeURIComponent(id)}`, { query: { fields: 'id,name,avatarUrl,bio,created' } }),
    request(BASE, { query: { filter: `author = ${quote(id)}`, perPage: 500, fields: 'likes,favoritesCount' } }),
  ]);
  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl || '',
    bio: user.bio || '',
    stats: {
      recipes: own.totalItems,
      likes: own.items.reduce((s, r) => s + (r.likes || 0), 0),
      favorites: own.items.reduce((s, r) => s + (r.favoritesCount || 0), 0),
    },
  };
}

export async function getAuthorRecipes(id, sort = 'popular') {
  const { items } = await getRecipes({ author: id, sort }, { limit: 200 });
  return items;
}

/**
 * Популярные авторы: сумма лайков по всем рецептам автора не меньше minLikes (по умолчанию 3).
 * Порядок — по лайкам, при равенстве — по добавлениям в избранное.
 * У каждого: число рецептов, лайки, добавления в избранное и самый популярный рецепт (больше всего лайков).
 * limit — сколько вернуть (на главной 4, на странице «Популярные авторы» — все).
 */
export async function getPopularAuthors({ limit, minLikes = POPULAR_AUTHOR_MIN_LIKES } = {}) {
  const res = await request(BASE, {
    query: { perPage: 500, expand: 'author', fields: `id,title,photoUrl,photoFit,author,likes,favoritesCount,${AUTHOR_FIELDS}` },
  });
  const byAuthor = new Map();
  for (const r of res.items) {
    const a = r.expand?.author;
    if (!a) continue;
    const cur = byAuthor.get(a.id) ?? { id: a.id, name: a.name, avatarUrl: a.avatarUrl || '', recipesCount: 0, likes: 0, favorites: 0, topRecipe: null };
    cur.recipesCount += 1;
    cur.likes += r.likes || 0;
    cur.favorites += r.favoritesCount || 0;
    const better = !cur.topRecipe || (r.likes || 0) > cur.topRecipe.likes || ((r.likes || 0) === cur.topRecipe.likes && (r.favoritesCount || 0) > cur.topRecipe.favoritesCount);
    if (better) cur.topRecipe = { id: r.id, title: r.title, photoUrl: r.photoUrl || '', photoFit: r.photoFit || null, likes: r.likes || 0, favoritesCount: r.favoritesCount || 0 };
    byAuthor.set(a.id, cur);
  }
  const popular = [...byAuthor.values()].filter((a) => a.likes >= minLikes).sort((a, b) => b.likes - a.likes || b.favorites - a.favorites);
  return limit ? popular.slice(0, limit) : popular;
}
