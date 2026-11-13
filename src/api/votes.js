// Голоса: один на пользователя и рецепт (уникальный индекс). Счётчики рецепта пересчитывает сервер.
import { request, quote } from './client.js';

const BASE = '/collections/votes/records';

/** Голос текущего пользователя за рецепт: { id, value } или null. */
export async function getMyVote(userId, recipeId) {
  const res = await request(BASE, {
    query: { filter: `user = ${quote(userId)} && recipe = ${quote(recipeId)}`, perPage: 1, fields: 'id,value', skipTotal: 1 },
  });
  return res.items[0] ?? null;
}

/**
 * Голосование: повторное нажатие отменяет голос, противоположное — переключает.
 * @returns {Promise<{ id, value } | null>} новый голос или null, если отменён
 */
export async function castVote(current, userId, recipeId, value) {
  if (current && current.value === value) {
    await request(`${BASE}/${current.id}`, { method: 'DELETE' });
    return null;
  }
  if (current) {
    const rec = await request(`${BASE}/${current.id}`, { method: 'PATCH', body: { value } });
    return { id: rec.id, value: rec.value };
  }
  const rec = await request(BASE, { method: 'POST', body: { user: userId, recipe: recipeId, value } });
  return { id: rec.id, value: rec.value };
}
