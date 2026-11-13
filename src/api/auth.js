// Пользователи PocketBase: вход по email и паролю, регистрация, обновление профиля.
import { request } from './client.js';
import { ApiError } from './errors.js';

const USERS = '/collections/users';

/** Запись пользователя → то, что нужно интерфейсу (без лишних системных полей). */
export function normalizeUser(r) {
  return { id: r.id, email: r.email, name: r.name || '', avatarUrl: r.avatarUrl || '', bio: r.bio || '' };
}

export async function login(email, password) {
  try {
    const res = await request(`${USERS}/auth-with-password`, { method: 'POST', body: { identity: email.trim(), password } });
    return { token: res.token, user: normalizeUser(res.record) };
  } catch (e) {
    // PocketBase отвечает 400 на неверную пару email/пароль
    if (e instanceof ApiError && e.status === 400) throw new ApiError('Неверный email или пароль', 400);
    throw e;
  }
}

export async function register({ name, email, password }) {
  await request(`${USERS}/records`, {
    method: 'POST',
    body: { name: name.trim(), email: email.trim(), password, passwordConfirm: password, emailVisibility: false },
  });
  return login(email, password);
}

/** Продлевает токен и заодно возвращает свежие данные пользователя. */
export async function refreshAuth() {
  const res = await request(`${USERS}/auth-refresh`, { method: 'POST' });
  return { token: res.token, user: normalizeUser(res.record) };
}

export async function updateProfile(id, { name, bio, avatarUrl }) {
  const rec = await request(`${USERS}/records/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: { name: name.trim(), bio: bio.trim(), avatarUrl: avatarUrl.trim() },
  });
  return normalizeUser(rec);
}
