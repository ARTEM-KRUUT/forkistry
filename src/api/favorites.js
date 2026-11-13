// Избранное текущего пользователя (коллекция favorites; правила пускают только к своим записям).
import { request, quote } from './client.js';
import { normalizeRecipe } from './recipes.js';

const BASE = '/collections/favorites/records';

/** Все избранные рецепты: [{ id: id записи избранного, recipe }]. */
export async function getMyFavorites(userId) {
  const res = await request(BASE, {
    query: { filter: `user = ${quote(userId)}`, sort: '-created', perPage: 500, expand: 'recipe,recipe.author' },
  });
  return res.items
    .filter((f) => f.expand?.recipe)
    .map((f) => {
      const r = f.expand.recipe;
      return { id: f.id, recipe: normalizeRecipe({ ...r, expand: { author: r.expand?.author } }) };
    });
}

export async function addFavorite(userId, recipeId) {
  const rec = await request(BASE, { method: 'POST', body: { user: userId, recipe: recipeId } });
  return rec.id;
}

export function removeFavorite(favoriteId) {
  return request(`${BASE}/${encodeURIComponent(favoriteId)}`, { method: 'DELETE' });
}
