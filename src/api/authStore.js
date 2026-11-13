// Токен и пользователь PocketBase в localStorage + подписка на изменения (для AuthContext).
const KEY = 'forkistry:auth';
const listeners = new Set();

let state = load();

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return saved?.token ? saved : { token: '', user: null };
  } catch {
    return { token: '', user: null };
  }
}

function persist() {
  try {
    if (state.token) localStorage.setItem(KEY, JSON.stringify(state));
    else localStorage.removeItem(KEY);
  } catch {
    // хранилище недоступно — сессия живёт до перезагрузки
  }
  listeners.forEach((fn) => fn(state));
}

export const getAuth = () => state;
export const getToken = () => state.token;

export function setAuth(token, user) {
  state = { token, user };
  persist();
}

export function setUser(user) {
  state = { ...state, user };
  persist();
}

/** reason: 'logout' — вышли сами (уводим на главную), 'expired' — токен отозван или истёк (на вход). */
export function clearAuth(reason = 'expired') {
  state = { token: '', user: null, reason };
  persist();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
