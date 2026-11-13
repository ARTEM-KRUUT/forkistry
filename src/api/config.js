// Базовый адрес PocketBase. Пусто — тот же домен (Caddy проксирует /api).
export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
