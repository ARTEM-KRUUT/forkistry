// Базовый REST-клиент PocketBase на fetch (без SDK — явно видно, какие запросы уходят).
import { API_URL } from './config.js';
import { ApiError } from './errors.js';
import { clearAuth, getToken } from './authStore.js';

/**
 * Запрос к /api{path}. query — объект параметров строки запроса, body — JSON тела.
 * Ошибки приводятся к ApiError: status 0 — нет сети, иначе HTTP-статус и data с ошибками полей.
 */
export async function request(path, { method = 'GET', query, body, signal } = {}) {
  const base = API_URL || window.location.origin;
  const url = new URL(`${base}/api${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    }
  }

  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers.Authorization = token;

  let res;
  try {
    res = await fetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal });
  } catch (e) {
    if (e?.name === 'AbortError') throw e;
    throw new ApiError('Нет соединения с сервером', 0);
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // Токен истёк или отозван — выходим, чтобы интерфейс не застрял в «полувходе»
    if (res.status === 401 && token) clearAuth();
    throw new ApiError(messageFor(res.status, data), res.status, data?.data ?? null);
  }
  return data;
}

function messageFor(status, data) {
  if (status === 404) return 'Не найдено';
  if (status === 401 || status === 403) return 'Недостаточно прав';
  if (status === 429) return 'Слишком много запросов, попробуйте через минуту';
  if (status >= 500) return 'Ошибка сервера';
  return data?.message || 'Не удалось выполнить запрос';
}

/** Строка для фильтра PocketBase в кавычках с экранированием. */
export function quote(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}
